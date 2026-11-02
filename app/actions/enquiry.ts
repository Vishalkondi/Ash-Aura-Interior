"use server";

import { z } from "zod";
import { enquiry } from "@/lib/site";
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

export type EnquiryField = "name" | "phone" | "email";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<EnquiryField, string>>;
};

const schema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  area: z.string().max(100),
  message: z.string().max(2000),
  // Chip answers are only kept when they match an offered option.
  space: z.string().transform((v) => (enquiry.spaceTypes.includes(v) ? v : "")),
  budget: z.string().transform((v) => (enquiry.budgets.includes(v) ? v : "")),
});

/** Validates an enquiry and emails it to the studio through Resend. */
export async function sendEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Pretend spam worked so bots don't retry.
  if (looksLikeSpam(formData)) return { status: "success" };

  const parsed = schema.safeParse({
    name: clean(formData.get("name"), 100),
    phone: clean(formData.get("phone"), 20),
    email: clean(formData.get("email"), 160),
    area: clean(formData.get("area"), 100),
    message: clean(formData.get("message"), 2000),
    space: clean(formData.get("space"), 60),
    budget: clean(formData.get("budget"), 60),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: fieldErrors<EnquiryField>(parsed.error),
    };
  }
  if (await isRateLimited("enquiry")) return { status: "error", message: RATE_LIMIT_MESSAGE };

  const { name, phone, email, area, message, space, budget } = parsed.data;
  const result = await sendLeadEmail({
    subject: `New enquiry from ${name}${area ? `, ${area}` : ""}`,
    heading: "New enquiry from the Ash Aura Interiors website.",
    replyTo: email,
    lines: [
      ...[
        `Name: ${name}`,
        `Phone: ${phone}`,
        email && `Email: ${email}`,
        area && `Area: ${area}`,
        space && `Space: ${space}`,
        budget && `Budget: ${budget}`,
        message && `\nAbout the project:\n${message}`,
      ].filter((line): line is string => Boolean(line)),
      "\n--",
      ...describeSource(formData.get("source")),
    ],
  });

  if (result === "not-configured") return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  if (result === "failed") return { status: "error", message: SEND_FAILED_MESSAGE };

  await sendAutoReply(email, name, "enquiry");
  return { status: "success" };
}
