import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { contact, site } from "@/lib/site";

/* ----------------------------------------------------------------------------
 * Shared by the lead server actions (enquiry, consultation booking): input
 * cleaning, rate limiting, lead-source details and sending email via Resend.
 * ------------------------------------------------------------------------- */

/** Strips control characters, trims and caps the length of a form value. */
export const clean = (value: FormDataEntryValue | null, max: number) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);

export const nameSchema = z.string().min(2, "Please enter your name.").max(100);
export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/[^\d+\s-]/g, ""))
  .refine((v) => {
    const digits = v.replace(/\D/g, "").length;
    return digits >= 10 && digits <= 15;
  }, "Please enter a 10-digit phone number.");
export const emailSchema = z.union([z.literal(""), z.email("Please check your email address.").max(160)]);

/** Field name → first error message, from a failed zod parse. */
export function fieldErrors<F extends string>(error: z.ZodError): Partial<Record<F, string>> {
  const out: Partial<Record<F, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as F;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Bots fill the hidden "company" field or submit within seconds of the page loading. */
export function looksLikeSpam(formData: FormData, minFillMs = 3000) {
  const startedAt = Number(formData.get("startedAt"));
  return Boolean(clean(formData.get("company"), 200)) || !startedAt || Date.now() - startedAt < minFillMs;
}

/* Rate limiting ------------------------------------------------------------ */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/**
 * True when this visitor's IP has sent too many leads recently. Counts are kept
 * in server memory, so they reset on redeploys and are per server instance:
 * enough to stop a form being hammered, not a hard guarantee.
 */
export async function isRateLimited(scope: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep memory bounded on a long-running server.
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

export const RATE_LIMIT_MESSAGE =
  "You have sent a few requests in a short time. Please wait a few minutes, or message us on WhatsApp.";

/* Lead source --------------------------------------------------------------- */

const sourceSchema = z
  .object({
    utm_source: z.string().max(100),
    utm_medium: z.string().max(100),
    utm_campaign: z.string().max(150),
    utm_term: z.string().max(150),
    utm_content: z.string().max(150),
    gclid: z.string().max(200),
    fbclid: z.string().max(200),
    referrer: z.string().max(300),
    landing: z.string().max(300),
    firstSeen: z.string().max(40),
  })
  .partial();

/** Readable "where this lead came from" lines for the email, from the hidden `source` field. */
export function describeSource(raw: FormDataEntryValue | null): string[] {
  let data: z.infer<typeof sourceSchema> = {};
  try {
    const parsed = sourceSchema.safeParse(JSON.parse(String(raw ?? "{}")));
    if (parsed.success) data = parsed.data;
  } catch {
    // Missing or malformed: report as direct.
  }

  const campaign = [data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ");
  const ads = [data.gclid && "Google Ads click", data.fbclid && "Facebook / Instagram click"].filter(Boolean).join(", ");
  let channel = "Direct (typed the address or a bookmark)";
  if (campaign) channel = `Campaign: ${campaign}`;
  else if (ads) channel = ads;
  else if (data.referrer) channel = `Referred by ${data.referrer}`;

  return [
    `Source: ${channel}`,
    data.utm_term && `Keyword: ${data.utm_term}`,
    data.utm_content && `Ad content: ${data.utm_content}`,
    data.landing && `First page visited: ${data.landing}`,
    data.firstSeen && `First visit: ${data.firstSeen}`,
  ].filter((line): line is string => Boolean(line));
}

/* Email --------------------------------------------------------------------- */

const FROM = () => process.env.ENQUIRY_FROM || "Ash Aura Website <onboarding@resend.dev>";

export const NOT_CONFIGURED_MESSAGE =
  "Our email form is not available right now. Please send your request on WhatsApp instead.";
export const SEND_FAILED_MESSAGE = "Sorry, your request could not be sent. Please try again, or message us on WhatsApp.";

/** Emails a lead to the studio. Returns false when email is not configured or Resend fails. */
export async function sendLeadEmail(opts: { subject: string; heading: string; lines: string[]; replyTo?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendLeadEmail: RESEND_API_KEY is not set");
    return "not-configured" as const;
  }
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM(),
      to: process.env.ENQUIRY_TO || contact.email,
      replyTo: opts.replyTo || undefined,
      subject: opts.subject,
      text: `${opts.heading}\n\n${opts.lines.join("\n")}\n`,
    });
    if (error) throw new Error(error.message);
    return "sent" as const;
  } catch (err) {
    console.error("sendLeadEmail: Resend failed", err);
    return "failed" as const;
  }
}

/**
 * Short thank-you to the visitor. Only works once a sending domain is verified
 * in Resend (ENQUIRY_FROM on that domain); failures are logged, never shown.
 */
export async function sendAutoReply(to: string, name: string, about: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to || !process.env.ENQUIRY_FROM) return;
  const firstName = name.split(" ")[0];
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.ENQUIRY_FROM,
      to,
      replyTo: contact.email,
      subject: `Thank you for contacting ${site.name}`,
      text: [
        `Hello ${firstName},`,
        "",
        `Thank you for getting in touch with ${site.name}. ${site.founder} has received your ${about} and will get back to you shortly.`,
        "",
        `If it is urgent, call or WhatsApp ${contact.phoneDisplay}.`,
        "",
        "Warm regards,",
        `${site.founder}`,
        `${site.name}, ${site.location}`,
        contact.instagramUrl,
      ].join("\n"),
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("sendAutoReply: Resend failed", err);
  }
}
