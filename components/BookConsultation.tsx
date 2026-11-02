"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendBooking, type BookingField, type BookingState } from "@/app/actions/booking";
import { WhatsAppIcon } from "./Icons";
import { LeadFields } from "./LeadFields";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { availableDays, type BookingDay } from "@/lib/booking";
import { EASE } from "@/lib/motion";
import { booking, contact } from "@/lib/site";

type Errors = Partial<Record<BookingField, string>>;

const label = "text-[0.65rem] uppercase tracking-[0.3em] text-gold-deep";
const field =
  "mt-2 w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-base font-light text-ink placeholder:text-ink/40 transition-colors duration-500 focus:border-ink focus:outline-none aria-invalid:border-accent";
const chip =
  "flex cursor-pointer items-center justify-center border border-ink/20 text-ink transition-colors duration-500 hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-beige peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink";

function whatsappLink(data: FormData, day?: BookingDay) {
  const get = (k: string) => String(data.get(k) ?? "").trim();
  const lines = [
    "Hello Aishwarya, I'd like to book a consultation.",
    "",
    day && `Day: ${day.label}`,
    get("slot") && `Time: ${get("slot")}`,
    get("meeting") && `Meeting: ${get("meeting")}`,
    `Name: ${get("name")}`,
    get("note") && `\n${get("note")}`,
  ].filter(Boolean);
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Day and time-slot picker: emails the request to the studio and opens it on WhatsApp. */
export function BookConsultation() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  // Days are worked out in the browser: the page is prerendered, so build-time dates would go stale.
  const [days, setDays] = useState<BookingDay[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<BookingState>({ status: "idle" });
  const [sent, setSent] = useState<{ when: string; whatsapp: string } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => setDays(availableDays()), []);

  const validate = (data: FormData) => {
    const next: Errors = {};
    if (!data.get("day")) next.day = "Please choose a day.";
    if (!data.get("slot")) next.slot = "Please choose a time.";
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
    setErrors(next);
    const first = (["day", "slot", "name", "phone", "email"] as const).find((f) => next[f]);
    if (first) {
      form.querySelector<HTMLInputElement>(`[name=${first}]`)?.focus();
      return;
    }

    const day = days.find((d) => d.key === data.get("day"));
    const whatsapp = whatsappLink(data, day);
    // Opened straight from the click so the browser doesn't treat it as a pop-up.
    window.open(whatsapp, "_blank", "noopener,noreferrer");

    startTransition(async () => {
      const result = await sendBooking(data);
      setState(result);
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.status === "success") setSent({ when: `${day?.label}, ${data.get("slot")}`, whatsapp });
    });
  };

  return (
    <section id="book" aria-labelledby="book-title" className="on-light bg-beige text-ink">
      <div className="mx-auto grid max-w-360 gap-14 px-5 py-24 sm:px-8 md:py-36 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-44">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-gold-deep">{booking.eyebrow}</p>
          <SplitText id="book-title" className="display mt-8 text-[clamp(2.6rem,6vw,5rem)]" text={booking.heading} />
          <p className="mt-8 max-w-sm text-base font-light leading-relaxed text-ink/75 md:text-[1.05rem]">
            {booking.body}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="min-w-0 lg:col-span-7 lg:col-start-6">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="flex flex-col items-start gap-6 border-l border-gold-deep pl-6"
              >
                <p className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-light lowercase leading-tight">
                  thank you, your request is in
                </p>
                <p className="max-w-md text-base font-light leading-relaxed text-ink/75">
                  You asked for <strong className="font-normal text-ink">{sent.when}</strong>. Aishwarya will confirm the
                  time with you on WhatsApp. If WhatsApp did not open, you can send the request from here.
                </p>
                <a
                  href={sent.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-ink px-7 py-4 text-[0.7rem] uppercase tracking-[0.26em] text-beige transition-colors duration-500 hover:bg-bottle"
                >
                  <WhatsAppIcon />
                  Open WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative grid gap-y-10"
              >
                <LeadFields />

                <fieldset className="min-w-0" aria-describedby={errors.day ? `${id}-day-error` : undefined}>
                  <legend className={label}>1. Choose a day</legend>
                  <div className="-mx-5 mt-4 flex gap-2.5 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0 sm:pb-0">
                    {days.length === 0
                      ? Array.from({ length: 12 }, (_, i) => (
                          <span key={i} aria-hidden="true" className="h-20 w-16 shrink-0 border border-ink/10 sm:w-auto" />
                        ))
                      : days.map((day) => (
                          <label key={day.key} className="relative w-16 shrink-0 sm:w-auto">
                            <input type="radio" name="day" value={day.key} className="peer sr-only" />
                            <span className={`${chip} h-20 flex-col gap-0.5`}>
                              <span className="text-[0.6rem] uppercase tracking-[0.2em] opacity-70">{day.weekday}</span>
                              <span className="font-serif text-2xl font-light leading-none">{day.day}</span>
                              <span className="text-[0.6rem] uppercase tracking-[0.2em] opacity-70">{day.month}</span>
                              <span className="sr-only">{day.label}</span>
                            </span>
                          </label>
                        ))}
                  </div>
                  {errors.day && <FieldError id={`${id}-day-error`}>{errors.day}</FieldError>}
                </fieldset>

                <fieldset className="min-w-0" aria-describedby={errors.slot ? `${id}-slot-error` : undefined}>
                  <legend className={label}>2. Choose a time</legend>
                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                    {booking.slots.map((slot) => (
                      <label key={slot} className="relative">
                        <input type="radio" name="slot" value={slot} className="peer sr-only" />
                        <span className={`${chip} h-12 text-sm font-light`}>{slot}</span>
                      </label>
                    ))}
                  </div>
                  {errors.slot && <FieldError id={`${id}-slot-error`}>{errors.slot}</FieldError>}
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className={label}>3. Where should we meet?</legend>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {booking.meetingTypes.map((type) => (
                      <label key={type} className="relative">
                        <input type="radio" name="meeting" value={type} className="peer sr-only" />
                        <span className={`${chip} rounded-full px-5 py-2.5 text-sm font-light`}>{type}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
                  <Input id={`${id}-name`} name="name" label="Name *" error={errors.name} autoComplete="name" />
                  <Input
                    id={`${id}-phone`}
                    name="phone"
                    label="Phone *"
                    error={errors.phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91"
                  />
                  <Input
                    id={`${id}-email`}
                    name="email"
                    label="Email"
                    error={errors.email}
                    type="email"
                    autoComplete="email"
                    placeholder="For a confirmation email"
                  />
                  <Input id={`${id}-note`} name="note" label="Anything to add?" placeholder="e.g. 2BHK in Wakad" />
                </div>

                <AnimatePresence>
                  {state.status === "error" && state.message && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-l border-accent pl-4 text-sm text-accent"
                    >
                      {state.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-sm font-light leading-relaxed text-ink/60">
                    Sends your request to Aishwarya and opens WhatsApp to confirm.
                  </p>
                  <button
                    type="submit"
                    disabled={pending}
                    aria-busy={pending}
                    className="inline-flex min-w-56 items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-beige transition-colors duration-500 hover:bg-bottle disabled:cursor-wait disabled:opacity-80"
                  >
                    {pending ? (
                      <>
                        <span
                          className="size-3.5 animate-spin rounded-full border border-beige/30 border-t-beige"
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon />
                        Request this time
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string };

function Input({ id, label: text, error, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className={label}>
        {text}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={field}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm text-accent">
      {children}
    </p>
  );
}
