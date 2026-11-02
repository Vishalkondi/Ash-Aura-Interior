"use client";

import { startTransition, useActionState, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { requestPortfolio, type PortfolioField, type PortfolioState } from "@/app/actions/portfolio";
import { LeadFields } from "./LeadFields";
import { EASE } from "@/lib/motion";

type Errors = Partial<Record<PortfolioField, string>>;

const label = "text-[0.65rem] uppercase tracking-[0.3em] text-gold";
const field =
  "mt-2 w-full border-0 border-b border-gold/30 bg-transparent px-0 py-3 text-base font-light text-beige placeholder:text-beige/35 transition-colors duration-500 focus:border-gold focus:outline-none aria-invalid:border-accent";

/** Name and phone, then the portfolio download link. */
export function PortfolioForm() {
  const id = useId();
  const [clientErrors, setClientErrors] = useState<Errors>({});
  const [state, formAction, pending] = useActionState<PortfolioState, FormData>(requestPortfolio, { status: "idle" });
  const errors: Errors = { ...state.fieldErrors, ...clientErrors };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    if (String(data.get("name") ?? "").trim().length < 2) next.name = "Please enter your name.";
    if (String(data.get("phone") ?? "").replace(/\D/g, "").length < 10)
      next.phone = "Please enter a 10-digit phone number.";
    setClientErrors(next);
    const first = (["name", "phone"] as const).find((f) => next[f]);
    if (first) {
      form.querySelector<HTMLInputElement>(`[name=${first}]`)?.focus();
      return;
    }
    startTransition(() => formAction(data));
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" && state.file ? (
        <motion.div
          key="done"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col items-start gap-6 border-l border-gold pl-6"
        >
          <p className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light lowercase leading-tight text-beige">
            thank you, it&apos;s ready
          </p>
          <a
            href={state.file}
            download
            className="group inline-flex items-center gap-3 bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-beige"
          >
            Download portfolio (PDF)
            <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative grid gap-x-8 gap-y-8 sm:grid-cols-2"
        >
          <LeadFields />
          {(["name", "phone"] as const).map((name) => (
            <div key={name}>
              <label htmlFor={`${id}-${name}`} className={label}>
                {name === "name" ? "Name *" : "Phone *"}
              </label>
              <input
                id={`${id}-${name}`}
                name={name}
                type={name === "phone" ? "tel" : "text"}
                inputMode={name === "phone" ? "tel" : undefined}
                autoComplete={name === "phone" ? "tel" : "name"}
                placeholder={name === "phone" ? "+91" : "Your full name"}
                aria-invalid={!!errors[name]}
                aria-describedby={errors[name] ? `${id}-${name}-error` : undefined}
                className={field}
              />
              {errors[name] && (
                <p id={`${id}-${name}-error`} className="mt-2 text-sm text-[#e8a0a8]">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}
          {state.status === "error" && state.message && !state.fieldErrors && (
            <p role="alert" className="border-l border-accent pl-4 text-sm text-[#e8a0a8] sm:col-span-2">
              {state.message}
            </p>
          )}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="inline-flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-beige disabled:cursor-wait disabled:opacity-80 sm:w-auto"
            >
              {pending ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border border-ink/30 border-t-ink" aria-hidden="true" />
                  One moment…
                </>
              ) : (
                "Get the portfolio"
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
