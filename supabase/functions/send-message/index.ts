// ============================================================
// send-message — outbound email / SMS / note
// ============================================================
//
// Called by the Triskope front-end whenever an agent clicks "Send"
// in a lead's Messages thread. Replaces the direct DB insert that's
// currently in App.jsx's sendMessage(), but the UI doesn't need to
// change much — just swap the supabase.from("messages").insert call
// for supabase.functions.invoke("send-message", { body: {...} }).
//
// Request body:
//   {
//     "leadId":  uuid,
//     "channel": "email" | "sms" | "note",
//     "body":    string,
//     "subject"?: string         // email only
//   }
//
// Required Supabase secrets (set via `supabase secrets set ...`):
//   RESEND_API_KEY        — used for outbound email
//   RESEND_FROM_EMAIL     — e.g., "agent@mail.triskope.io"
//   RESEND_REPLY_DOMAIN   — e.g., "reply.triskope.io" (for lead+UUID@... reply-to)
//   TWILIO_ACCOUNT_SID    — used for outbound SMS
//   TWILIO_AUTH_TOKEN
//   TWILIO_PHONE_NUMBER   — e.g., "+18435550100"
//
// Deploy:
//   supabase functions deploy send-message
//
// Authentication: the caller's JWT is forwarded so RLS on the leads
// table prevents an agent from sending to leads they don't own.
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, handleCorsPreflight, json, err } from "../_shared/cors.ts";

interface SendPayload {
  leadId: string;
  channel: "email" | "sms" | "note";
  body: string;
  subject?: string;
}

Deno.serve(async (req: Request) => {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return err("Method not allowed", 405);

  // Require an authenticated caller — we forward their JWT so RLS applies
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return err("Missing Authorization header", 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return err("Unauthorized", 401);

  // Parse payload
  let payload: SendPayload;
  try { payload = await req.json(); }
  catch { return err("Invalid JSON body"); }

  const { leadId, channel, body, subject } = payload;
  if (!leadId || !channel || !body) return err("leadId, channel, and body are required");
  if (!["email", "sms", "note"].includes(channel)) return err("Unknown channel");

  // Look up the lead. RLS prevents reading leads the caller can't access.
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, name, email, phone, agent_id")
    .eq("id", leadId)
    .maybeSingle();
  if (leadErr || !lead) return err("Lead not found", 404);

  let externalId: string | null = null;
  let provider: string | null = null;

  if (channel === "email") {
    if (!lead.email) return err("Lead has no email address", 422);

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) return err("RESEND_API_KEY not configured", 500);

    const from = Deno.env.get("RESEND_FROM_EMAIL") ?? "agent@triskope.io";
    const replyDomain = Deno.env.get("RESEND_REPLY_DOMAIN") ?? "reply.triskope.io";
    const replyTo = `lead+${lead.id}@${replyDomain}`;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: lead.email,
        subject: subject || "(no subject)",
        text: body,
        reply_to: replyTo,
        tags: [{ name: "lead_id", value: lead.id }],
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return err(`Resend error: ${detail}`, 502);
    }
    const data = await resp.json();
    externalId = data.id ?? null;
    provider = "resend";
  } else if (channel === "sms") {
    if (!lead.phone) return err("Lead has no phone number", 422);

    const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const token = Deno.env.get("TWILIO_AUTH_TOKEN");
    const fromPhone = Deno.env.get("TWILIO_PHONE_NUMBER");
    if (!sid || !token || !fromPhone) return err("Twilio not configured", 500);

    const params = new URLSearchParams({
      From: fromPhone,
      To: lead.phone,
      Body: body,
    });

    const resp = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      },
    );

    if (!resp.ok) {
      const detail = await resp.text();
      return err(`Twilio error: ${detail}`, 502);
    }
    const data = await resp.json();
    externalId = data.sid ?? null;
    provider = "twilio";
  }
  // channel === "note" — no provider call, store only

  // Persist the message row using the caller's JWT (RLS applies)
  const { data: stored, error: insertErr } = await supabase
    .from("messages")
    .insert({
      lead_id: lead.id,
      agent_id: lead.agent_id,
      direction: "outbound",
      channel,
      subject: subject ?? null,
      body,
      external_id: externalId,
    })
    .select()
    .single();

  if (insertErr) return err(`DB error: ${insertErr.message}`, 500);

  return json({ message: stored, provider });
});
