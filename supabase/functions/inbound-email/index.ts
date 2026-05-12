// ============================================================
// inbound-email — webhook for incoming email replies
// ============================================================
//
// Receives parsed inbound email from your email provider. The simplest
// way to wire this up is to use a provider that does inbound parsing:
//   • Postmark Inbound (free tier, very simple JSON payload)
//   • Mailgun Routes  (free tier)
//   • SendGrid Inbound Parse
//   • Resend (now supports inbound; payload differs slightly)
//
// Steps to configure (Postmark example):
//   1. In Postmark, set up an Inbound stream pointing at a subdomain
//      you own — e.g., reply.triskope.io
//   2. Update DNS: add an MX record for reply.triskope.io pointing at
//      Postmark's MX target.
//   3. Set Postmark webhook to:
//      https://YOUR_PROJECT.functions.supabase.co/inbound-email?secret=YOUR_WEBHOOK_SECRET
//   4. Outbound emails should be sent with reply_to of
//      lead+UUID@reply.triskope.io (the send-message function already does this).
//      Postmark parses the +tag, putting the full address in `OriginalRecipient`
//      and giving you `FromFull`, `Subject`, `TextBody`, `HtmlBody`.
//
// Lead lookup strategy:
//   1. Parse the "+" alias from the To address (lead+UUID@...) — that
//      gives the lead UUID directly.
//   2. Fallback: match the From address against any lead.email in the DB.
//
// Required secrets:
//   INBOUND_WEBHOOK_SECRET — random string you put in the query param
//                            ?secret=... when configuring the webhook.
//                            (Replace with provider signature verification
//                            for production.)
//
// Deploy:
//   supabase functions deploy inbound-email --no-verify-jwt
// (The --no-verify-jwt flag is required because webhooks don't carry
//  a user JWT.)
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });
const err = (m: string, status = 400) => json({ error: m }, status);

interface PostmarkInbound {
  FromFull?:           { Email?: string; Name?: string };
  From?:               string;
  ToFull?:             { Email?: string }[];
  OriginalRecipient?:  string;
  Subject?:            string;
  TextBody?:           string;
  HtmlBody?:           string;
  MessageID?:          string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return err("Method not allowed", 405);

  // Shared-secret check (replace with provider signature verification
  // for production — Postmark supports basic auth on webhooks too).
  const expected = Deno.env.get("INBOUND_WEBHOOK_SECRET");
  if (expected) {
    const url = new URL(req.url);
    const got = url.searchParams.get("secret") ?? req.headers.get("X-Webhook-Secret");
    if (got !== expected) return err("Bad secret", 401);
  }

  let body: PostmarkInbound;
  try { body = await req.json(); }
  catch { return err("Invalid JSON"); }

  const fromEmail   = body.FromFull?.Email ?? body.From ?? "";
  const toEmail     = body.OriginalRecipient ?? body.ToFull?.[0]?.Email ?? "";
  const subject     = body.Subject ?? null;
  const text        = body.TextBody ?? body.HtmlBody ?? "";
  const externalId  = body.MessageID ?? null;

  if (!fromEmail || !text) return err("Missing from/body");

  // Service-role client — bypasses RLS so we can write any lead's messages.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1) Try to extract the lead UUID from the To address: lead+UUID@reply.x.com
  let leadId: string | null = null;
  const plusMatch = toEmail.match(/\+([0-9a-f-]{36})@/i);
  if (plusMatch) leadId = plusMatch[1];

  // 2) Fallback: match by From email
  if (!leadId) {
    const { data: matched } = await supabase
      .from("leads")
      .select("id")
      .ilike("email", fromEmail)
      .limit(1)
      .maybeSingle();
    if (matched) leadId = matched.id;
  }

  if (!leadId) return err("Could not match inbound email to a lead", 404);

  const { error: insertErr } = await supabase.from("messages").insert({
    lead_id:     leadId,
    direction:   "inbound",
    channel:     "email",
    subject,
    body:        text,
    external_id: externalId,
  });

  if (insertErr) return err(`DB error: ${insertErr.message}`, 500);

  // TODO: fire an in-app notification + an email/SMS alert to the assigned agent
  return json({ ok: true, lead_id: leadId });
});
