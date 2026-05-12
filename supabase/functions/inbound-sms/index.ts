// ============================================================
// inbound-sms — webhook for incoming SMS replies (Twilio)
// ============================================================
//
// Twilio POSTs an x-www-form-urlencoded payload to this endpoint
// whenever someone texts your Twilio number. Configure it in the
// Twilio console under Phone Numbers → Active Numbers → your number
// → Messaging → "A MESSAGE COMES IN" webhook:
//
//   https://YOUR_PROJECT.functions.supabase.co/inbound-sms
//
// (You can optionally append ?secret=... for a basic shared-secret
// check — for production, swap this for Twilio's X-Twilio-Signature
// header verification using your auth token. See:
// https://www.twilio.com/docs/usage/webhooks/webhooks-security)
//
// Required Supabase secrets:
//   INBOUND_WEBHOOK_SECRET    (optional, for the shared-secret check)
//   TWILIO_AUTH_TOKEN         (for future X-Twilio-Signature verification)
//
// Deploy:
//   supabase functions deploy inbound-sms --no-verify-jwt
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const text = (s: string, status = 200) =>
  new Response(s, { status, headers: { "Content-Type": "text/plain" } });

// Twilio expects a TwiML response (or 200 OK). Return a 200 with empty
// TwiML so they don't auto-reply on our behalf.
const TWIML_OK = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return text("Method not allowed", 405);

  const expected = Deno.env.get("INBOUND_WEBHOOK_SECRET");
  if (expected) {
    const url = new URL(req.url);
    const got = url.searchParams.get("secret") ?? req.headers.get("X-Webhook-Secret");
    if (got !== expected) return text("Bad secret", 401);
  }

  // Twilio sends x-www-form-urlencoded
  const form = await req.formData();
  const fromPhone   = (form.get("From")        ?? "").toString();
  const body        = (form.get("Body")        ?? "").toString();
  const messageSid  = (form.get("MessageSid")  ?? "").toString();

  if (!fromPhone || !body) return text("Missing From or Body", 400);

  // Normalize: strip non-digit characters for comparison
  const digits = fromPhone.replace(/[^0-9]/g, "");
  const last10 = digits.slice(-10);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Find a lead whose phone number ends with the same 10 digits
  // (handles +1 prefix variations).
  const { data: matched } = await supabase
    .from("leads")
    .select("id")
    .ilike("phone", `%${last10.slice(0, 3)}%${last10.slice(3, 6)}%${last10.slice(6)}%`)
    .limit(1)
    .maybeSingle();

  if (!matched) {
    // Optional: insert into an "unknown_inbound" table for triage.
    return text(TWIML_OK, 200);
  }

  await supabase.from("messages").insert({
    lead_id:     matched.id,
    direction:   "inbound",
    channel:     "sms",
    subject:     null,
    body,
    external_id: messageSid,
  });

  return text(TWIML_OK, 200);
});
