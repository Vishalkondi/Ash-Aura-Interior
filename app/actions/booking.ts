"use server";

import { z } from "zod";
import { findBookableDay } from "@/lib/booking";
import { booking } from "@/lib/site";
import {
  NOT_CONFIGURED_MESSAGE,
  RATE_LIMIT_MESSAGE,
  SEND_FAILED_MESSAGE,
  clean,
  describeSource,
  emailSchema,
  fieldErrors,
  isRateLimited,
  looksLikeSpam,
  nameSchema,
  phoneSchema,
  sendAutoReply,
  sendLeadEmail,
} from "@/lib/leads";

export type BookingField = "name" | "phone" | "email" | "day" | "slot";

export type BookingState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<BookingField, string>>;
};

const schema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  day: z.string().refine((key) => Boolean(findBookableDay(key)), "Please choose a day."),
  slot: z.string().refine((slot) => booking.slots.includes(slot), "Please choose a time."),
  meeting: z.string().transform((v) => (booking.meetingTypes.includes(v) ? v : "")),
  note: z.string().max(1000),
});

/** Emails a consultation request to the studio. The visitor also confirms it on WhatsApp. */
export async function sendBooking(formData: FormData): Promise<BookingState> {
  if (looksLikeSpam(formData)) return { status: "success" };

  const parsed = schema.safeParse({
    name: clean(formData.get("name"), 100),
    phone: clean(formData.get("phone"), 20),
    email: clean(formData.get("email"), 160),
    day: clean(formData.get("day"), 10),
    slot: clean(formData.get("slot"), 20),
    meeting: clean(formData.get("meeting"), 40),
    note: clean(formData.get("note"), 1000),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: fieldErrors<BookingField>(parsed.error),
    };
  }
  if (await isRateLimited("booking")) return { status: "error", message: RATE_LIMIT_MESSAGE };

  const { name, phone, email, day, slot, meeting, note } = parsed.data;
  const when = `${findBookableDay(day)?.label}, ${slot}`;
  const result = await sendLeadEmail({
    subject: `Consultation request: ${name}, ${when}`,
    heading: "New consultation request from the Ash Aura Interiors website. Please confirm the time with the client.",
    replyTo: email,
    lines: [
      ...[
        `Requested: ${when}`,
        meeting && `Meeting: ${meeting}`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        email && `Email: ${email}`,
        note && `\nNote:\n${note}`,
      ].filter((line): line is string => Boolean(line)),
      "\n--",
      ...describeSource(formData.get("source")),
    ],
  });

  if (result === "not-configured") return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  if (result === "failed") return { status: "error", message: SEND_FAILED_MESSAGE };

  await sendAutoReply(email, name, `consultation request for ${when}`);
  return { status: "success" };
}
