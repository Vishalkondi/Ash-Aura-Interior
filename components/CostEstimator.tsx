"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { WhatsAppIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { ScrollLine } from "./ScrollLine";
import { SplitText } from "./SplitText";
import { contact, estimator } from "@/lib/site";
import { EASE } from "@/lib/motion";

/** ₹ amount as "₹40,000", "₹4.2 lakh" or "₹1.15 crore", rounded to the nearest ₹10,000. */
function formatInr(amount: number) {
  const rounded = Math.max(10000, Math.round(amount / 10000) * 10000);
  if (rounded < 1e5) return `₹${rounded.toLocaleString("en-IN")}`;
  if (rounded >= 1e7) return `₹${(rounded / 1e7).toFixed(2).replace(/\.?0+$/, "")} crore`;
  return `₹${(rounded / 1e5).toFixed(1).replace(/\.0$/, "")} lakh`;
}

type ChoiceProps = {
  legend: string;
  name: string;
  options: { label: string; hint?: string }[];
  value: string;
  onChange: (label: string) => void;
  columns: string;
};

function Choice({ legend, name, options, value, onChange, columns }: ChoiceProps) {
  return (
    <fieldset>
      <legend className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">{legend}</legend>
      <div className={`mt-4 grid gap-2.5 ${columns}`}>
        {options.map((option) => {
          const checked = value === option.label;
          return (
            <label
              key={option.label}
              className={`flex cursor-pointer flex-col justify-center border px-4 py-3 transition-colors duration-500 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                checked ? "border-gold bg-gold text-ink" : "border-gold/25 text-beige hover:border-gold"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.label}
                checked={checked}
                onChange={() => onChange(option.label)}
                className="sr-only"
              />
              <span className="font-serif text-lg leading-tight">{option.label}</span>
              {option.hint && (
                <span className={`mt-1 text-[0.62rem] uppercase tracking-[0.18em] ${checked ? "text-ink/70" : "text-gold/90"}`}>
                  {option.hint}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Area, finish and scope in; an indicative budget range out, with a prefilled WhatsApp message. */
export function CostEstimator() {
  const id = useId();
  const [space, setSpace] = useState(estimator.spaces[2].label);
  const [area, setArea] = useState(estimator.spaces[2].area);
  const [finish, setFinish] = useState(estimator.finishes[1].label);
  const [scope, setScope] = useState(estimator.scopes[0].label);

  const tier = estimator.finishes.find((f) => f.label === finish) ?? estimator.finishes[0];
  const factor = (estimator.scopes.find((s) => s.label === scope) ?? estimator.scopes[0]).factor;
  const low = formatInr(area * tier.rate[0] * factor);
  const high = formatInr(area * tier.rate[1] * factor);
  // Where the area sits on the slider, for the filled track.
  const fill = ((area - estimator.minArea) / (estimator.maxArea - estimator.minArea)) * 100;

  const message = [
    "Hello Aishwarya, I used the cost estimator on your website.",
    "",
    `Space: ${space}`,
    `Carpet area: about ${area} sq ft`,
    `Finish: ${finish}`,
    `Scope: ${scope}`,
    `Indicative range: ${low} – ${high}`,
    "",
    "I'd like to talk about my project.",
  ].join("\n");

  return (
    <section id="estimate" aria-labelledby="estimate-title" className="relative bg-ink">
      <ScrollLine />
      <div className="mx-auto grid max-w-360 gap-12 px-5 py-24 sm:px-8 md:py-36 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-gold">{estimator.eyebrow}</p>
          <SplitText id="estimate-title" text={estimator.heading} className="display mt-8 text-[clamp(2.4rem,5.5vw,4.5rem)]" />
          <p className="mt-6 max-w-sm text-base font-light leading-relaxed text-beige/70">{estimator.intro}</p>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7 lg:col-start-6">
          <div className="border border-gold/20 bg-ink-soft">
            <div className="space-y-10 p-6 sm:p-10 lg:p-12">
              <Choice
                legend="Space"
                name={`${id}-space`}
                options={estimator.spaces}
                value={space}
                onChange={(label) => {
                  setSpace(label);
                  setArea(estimator.spaces.find((s) => s.label === label)?.area ?? area);
                }}
                columns="grid-cols-2 sm:grid-cols-3"
              />

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={`${id}-area`} className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
                    Carpet area
                  </label>
                  <output htmlFor={`${id}-area`} className="font-serif text-2xl font-light tabular-nums text-beige">
                    {area.toLocaleString("en-IN")} <span className="text-base text-beige/60">sq ft</span>
                  </output>
                </div>
                <input
                  id={`${id}-area`}
                  type="range"
                  min={estimator.minArea}
                  max={estimator.maxArea}
                  step={10}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="estimator-range mt-5 w-full"
                  style={{ "--fill": `${fill}%` } as React.CSSProperties}
                />
                <div aria-hidden="true" className="mt-2 flex justify-between text-[0.6rem] uppercase tracking-[0.2em] text-beige/45">
                  <span>{estimator.minArea}</span>
                  <span>{estimator.maxArea.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Choice
                legend="Finish"
                name={`${id}-finish`}
                options={estimator.finishes}
                value={finish}
                onChange={setFinish}
                columns="sm:grid-cols-3"
              />

              <Choice
                legend="Scope"
                name={`${id}-scope`}
                options={estimator.scopes}
                value={scope}
                onChange={setScope}
                columns="sm:grid-cols-3"
              />
            </div>

            <div className="border-t border-gold/20 bg-bottle/60 p-6 sm:p-10 lg:px-12">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">Indicative range</p>
              <motion.p
                key={`${low}-${high}`}
                initial={{ opacity: 0.4, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                aria-live="polite"
                className="mt-3 font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-light leading-none text-beige"
              >
                {low} <span className="text-gold">–</span> {high}
              </motion.p>
              <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-beige/65">
                Excludes appliances, loose furniture and GST. Your quote is prepared from the detailed design, with a
                clear bill of quantities.
              </p>
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
                <a
                  href="#book"
                  className="inline-flex items-center justify-center border border-gold/70 px-7 py-4 text-[0.7rem] uppercase tracking-[0.26em] text-beige transition-colors duration-500 hover:border-beige hover:bg-beige hover:text-ink"
                >
                  Book a consultation
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
