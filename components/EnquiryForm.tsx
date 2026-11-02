"use client";

import { startTransition, useActionState, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendEnquiry, type EnquiryField, type EnquiryState } from "@/app/actions/enquiry";
import { WhatsAppIcon } from "./Icons";
import { LeadFields } from "./LeadFields";
import { contact, enquiry } from "@/lib/site";

type Errors = Partial<Record<EnquiryField, string>>;

/** Emails the enquiry to the studio, with WhatsApp as an alternative. */
export function EnquiryForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [space, setSpace] = useState("");
  const [budget, setBudget] = useState("");
  const [clientErrors, setClientErrors] = useState<Errors>({});
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(sendEnquiry, { status: "idle" });
  const errors: Errors = { ...state.fieldErrors, ...clientErrors };

  const validate = (data: FormData) => {
    const next: Errors = {};
    if (String(data.get("name") ?? "").trim().length < 2) next.name = "Please enter your name.";
    if (String(data.get("phone") ?? "").replace(/\D/g, "").length < 10)
      next.phone = "Please enter a 10-digit phone number.";
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please check your email address.";
    return next;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next = validate(data);
    setClientErrors(next);
    const first = (["name", "phone", "email"] as const).find((f) => next[f]);
    if (first) {
      form.querySelector<HTMLInputElement>(`[name=${first}]`)?.focus();
      return;
    }
    // Calling the action directly (not via the form's action prop) keeps the fields filled if it fails.
    startTransition(() => formAction(data));
  };

  const openWhatsApp = () => {
    const data = new FormData(formRef.current ?? undefined);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const lines = [
      "Hello Aishwarya, I'd like to discuss an interior project.",
      "",
      get("name") && `Name: ${get("name")}`,
      get("phone") && `Phone: ${get("phone")}`,
      get("area") && `Area: ${get("area")}`,
      space && `Space: ${space}`,
      budget && `Budget: ${budget}`,
      get("message") && `\n${get("message")}`,
    ].filter(Boolean);
    window.open(
      `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const field =
    "mt-2 w-full border-0 border-b border-gold/30 bg-transparent px-0 py-3 text-base font-light text-beige placeholder:text-beige/35 transition-colors duration-500 focus:border-gold focus:shadow-[0_1px_0_0_var(--color-gold)] focus:outline-none focus-visible:outline-none aria-invalid:border-accent";
  const label = "text-[0.65rem] uppercase tracking-[0.3em] text-gold";

  if (state.status === "success") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-start gap-6 border-l border-gold pl-6"
      >
        <p className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-light lowercase leading-tight text-beige">
          thank you, your enquiry is on its way
        </p>
        <p className="max-w-md text-base font-light leading-relaxed text-beige/70">
          Aishwarya will get back to you shortly to plan a first conversation. For anything urgent, call{" "}
          <a href={contact.phoneHref} className="text-gold underline-offset-4 hover:underline">
            {contact.phoneDisplay}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
      <LeadFields />
      <input type="hidden" name="space" value={space} />
      <input type="hidden" name="budget" value={budget} />

      <TextField id={`${id}-name`} name="name" label="Name *" error={errors.name} labelClass={label}>
        <input autoComplete="name" placeholder="Your full name" className={field} />
      </TextField>

      <TextField id={`${id}-phone`} name="phone" label="Phone *" error={errors.phone} labelClass={label}>
        <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" className={field} />
      </TextField>

      <TextField id={`${id}-email`} name="email" label="Email" error={errors.email} labelClass={label}>
        <input type="email" autoComplete="email" placeholder="So we can reply by email" className={field} />
      </TextField>

      <TextField id={`${id}-area`} name="area" label="Area" labelClass={label}>
        <input placeholder="e.g. Wakad, Ravet, Baner" className={field} />
      </TextField>

      <ChipGroup legend="Type of space" options={enquiry.spaceTypes} value={space} onChange={setSpace} />
      <ChipGroup legend="Approximate budget" options={enquiry.budgets} value={budget} onChange={setBudget} />

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className={label}>
          About your project
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Rooms, timeline, a style you love…"
          className={`${field} resize-none`}
        />
      </div>

      <AnimatePresence>
        {state.status === "error" && state.message && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-l border-accent pl-4 text-sm text-[#e8a0a8] sm:col-span-2"
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={openWhatsApp}
          className="inline-flex items-center justify-center gap-3 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-beige/70 transition-colors duration-500 hover:text-gold sm:justify-start"
        >
          <WhatsAppIcon />
          Or send on WhatsApp
        </button>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex min-w-52 items-center justify-center gap-3 bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-beige disabled:cursor-wait disabled:opacity-80"
        >
          {pending ? (
            <>
              <span className="size-3.5 animate-spin rounded-full border border-ink/30 border-t-ink" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
      </div>
    </form>
  );
}

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  labelClass: string;
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
};

function TextField({ id, name, label, labelClass, error, children }: TextFieldProps) {
  const input = children;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        {...input.props}
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#e8a0a8]">
          {error}
        </p>
      )}
    </div>
  );
}

type ChipGroupProps = {
  legend: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function ChipGroup({ legend, options, value, onChange }: ChipGroupProps) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : option)}
              className={`rounded-full border px-4 py-2 text-sm font-light transition-colors duration-500 ${
                selected
                  ? "border-gold bg-gold text-ink"
                  : "border-gold/30 text-beige/80 hover:border-gold hover:text-beige"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
