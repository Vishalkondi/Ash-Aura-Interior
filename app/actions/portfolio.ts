"use server";

import { z } from "zod";
import { portfolio } from "@/lib/site";
import {
  RATE_LIMIT_MESSAGE,
  clean,
  describeSource,
  fieldErrors,
  isRateLimited,
  looksLikeSpam,
  nameSchema,
  phoneSchema,
  sendLeadEmail,
} from "@/lib/leads";

export type PortfolioField = "name" | "phone";

export type PortfolioState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<PortfolioField, string>>;
  /** The download link, given once the details are valid. */
  file?: string;
};

const schema = z.object({ name: nameSchema, phone: phoneSchema });

/**
 * Emails a portfolio request to Aishwarya, then returns the download link.
 * The download is given even if the email fails, so a mail problem never
 * blocks a visitor; the failure is logged on the server.
 */
export async function requestPortfolio(_prev: PortfolioState, formData: FormData): Promise<PortfolioState> {
  if (looksLikeSpam(formData, 1500)) return { status: "success", file: portfolio.file };

  const parsed = schema.safeParse({
    name: clean(formData.get("name"), 100),
    phone: clean(formData.get("phone"), 20),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: fieldErrors<PortfolioField>(parsed.error),
    };
  }
  if (await isRateLimited("portfolio")) return { status: "error", message: RATE_LIMIT_MESSAGE };

  const { name, phone } = parsed.data;
  await sendLeadEmail({
    subject: `Portfolio downloaded by ${name}`,
    heading: "Someone downloaded the portfolio from the Ash Aura Interiors website. A good moment to follow up.",
    lines: [`Name: ${name}`, `Phone: ${phone}`, "\n--", ...describeSource(formData.get("source"))],
  });

  return { status: "success", file: portfolio.file };
}
