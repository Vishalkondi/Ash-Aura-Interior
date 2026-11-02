"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { contact, enquiry, getProject, photoDetails, photos, projectHref, quiz } from "@/lib/site";
import { EASE } from "@/lib/motion";

type Answers = { room?: string; size?: string; style?: string; budget?: string };
type StepKey = keyof Answers;

const steps: { key: StepKey; question: string; options: { value: string; hint?: string }[] }[] = [
  { key: "room", question: "Which space are you planning?", options: quiz.rooms.map((value) => ({ value })) },
  { key: "size", question: "How big is your home or space?", options: quiz.sizes.map((value) => ({ value })) },
  {
    key: "style",
    question: "Which look feels most like you?",
    options: quiz.styles.map((s) => ({ value: s.label, hint: s.hint })),
  },
  { key: "budget", question: "What budget are you working with?", options: enquiry.budgets.map((value) => ({ value })) },
];

/** Four quick questions that end with a suggested style and a prefilled WhatsApp message. */
export function StyleQuiz() {
  const id = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const moved = useRef(false);
  const done = step >= steps.length;

  // Focus each new question (or the result) as it mounts, which happens after
  // the previous one has animated out. Skipped on first load.
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && moved.current) el.focus();
  }, []);

  const choose = (key: StepKey, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    moved.current = true;
    // a short pause so the selection registers before the next question
    window.setTimeout(() => setStep((s) => s + 1), 280);
  };

  const style = quiz.styles.find((s) => s.label === answers.style);
  const example = style ? getProject(style.project) : undefined;
  const message = [
    "Hello Aishwarya, I took the style quiz on your website.",
    "",
    `Space: ${answers.room}`,
    `Size: ${answers.size}`,
    `Style: ${answers.style}`,
    `Budget: ${answers.budget}`,
    "",
    "I'd like to talk about my project.",
  ].join("\n");

  return (
    <section id="style-quiz" aria-labelledby="quiz-title" className="bg-ink">
      <div className="mx-auto grid max-w-360 gap-12 px-5 py-24 sm:px-8 md:py-36 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-gold">{quiz.eyebrow}</p>
          <SplitText id="quiz-title" text={quiz.heading} className="display mt-8 text-[clamp(2.4rem,5.5vw,4.5rem)]" />
          <p className="mt-6 max-w-sm text-base font-light leading-relaxed text-beige/70">{quiz.intro}</p>
        </Reveal>

        <div className="min-h-[30rem] border border-gold/20 bg-ink-soft p-6 sm:p-10 lg:col-span-7 lg:col-start-6 lg:p-12">
          {/* progress */}
          <div className="flex items-center gap-4" aria-hidden="true">
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
              {done ? "Your style" : `${String(step + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`}
            </span>
            <span className="relative h-px flex-1 bg-gold/20">
              <motion.span
                className="absolute inset-y-0 left-0 bg-gold"
                animate={{ width: `${(Math.min(step, steps.length) / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!done ? (
              <motion.fieldset
                key={steps[step].key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-10"
              >
                <legend className="w-full">
                  <span className="sr-only">
                    Question {step + 1} of {steps.length}:{" "}
                  </span>
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-serif text-[clamp(1.7rem,3.4vw,2.5rem)] font-light lowercase leading-tight text-beige focus:outline-none"
                  >
                    {steps[step].question}
                  </h3>
                </legend>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {steps[step].options.map((option) => {
                    const key = steps[step].key;
                    const checked = answers[key] === option.value;
                    const inputId = `${id}-${key}-${option.value}`;
                    return (
                      <label
                        key={option.value}
                        htmlFor={inputId}
                        className={`group flex cursor-pointer flex-col justify-center border px-5 py-4 transition-colors duration-500 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                          checked ? "border-gold bg-gold text-ink" : "border-gold/25 text-beige hover:border-gold"
                        }`}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name={`${id}-${key}`}
                          value={option.value}
                          checked={checked}
                          onChange={() => choose(key, option.value)}
                          className="sr-only"
                        />
                        <span className="font-serif text-xl">{option.value}</span>
                        {option.hint && (
                          <span
                            className={`mt-1 text-[0.62rem] uppercase tracking-[0.22em] ${checked ? "text-ink/70" : "text-gold"}`}
                          >
                            {option.hint}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      moved.current = true;
                      setStep((s) => s - 1);
                    }}
                    className="mt-8 text-[0.68rem] uppercase tracking-[0.28em] text-beige/60 transition-colors duration-500 hover:text-gold"
                  >
                    ← Back
                  </button>
                )}
              </motion.fieldset>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="mt-10 grid gap-8 sm:grid-cols-5"
                aria-live="polite"
              >
                {example && (
                  <Link
                    href={projectHref(example)}
                    className="group relative aspect-[4/5] overflow-hidden sm:col-span-2"
                    aria-label={`See a ${style?.label.toLowerCase()} example: ${example.name}`}
                  >
                    <Image
                      src={photos[example.slot]}
                      alt={photoDetails[example.slot].alt}
                      fill
                      sizes="(min-width: 640px) 20rem, 100vw"
                      className="object-cover transition-transform duration-[2400ms] ease-calm group-hover:scale-[1.06]"
                    />
                  </Link>
                )}
                <div className="sm:col-span-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">Your style is</p>
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] font-light lowercase leading-tight text-beige focus:outline-none"
                  >
                    {style?.label}
                  </h3>
                  <p className="mt-4 text-base font-light leading-relaxed text-beige/75">{style?.description}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {(["room", "size", "budget"] as const).map((k) => (
                      <div key={k}>
                        <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                          {k === "room" ? "Space" : k}
                        </dt>
                        <dd className="mt-1 font-light text-beige/85">{answers[k]}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                    <a
                      href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 text-[0.7rem] uppercase tracking-[0.26em] text-ink transition-colors duration-500 hover:bg-beige"
                    >
                      <WhatsAppIcon />
                      Send to Aishwarya
                      <span className="sr-only">(opens WhatsApp in a new tab)</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        moved.current = true;
                        setAnswers({});
                        setStep(0);
                      }}
                      className="text-[0.68rem] uppercase tracking-[0.28em] text-beige/60 transition-colors duration-500 hover:text-gold"
                    >
                      Start again
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
