"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { getProject, materials, projectHref } from "@/lib/site";
import { EASE } from "@/lib/motion";

/**
 * A strip of material swatches drawn in CSS (.swatch-* in globals.css). The
 * chosen one grows and its notes, uses and an example project show alongside.
 */
export function Materials() {
  const [active, setActive] = useState(materials.items[0].id);
  const material = materials.items.find((m) => m.id === active) ?? materials.items[0];
  const example = material.project ? getProject(material.project) : undefined;

  return (
    <section id="materials" aria-labelledby="materials-title" className="bg-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">{materials.eyebrow}</p>
            <SplitText id="materials-title" className="display mt-8 text-[clamp(2.4rem,6vw,5rem)]" text={materials.heading} />
          </div>
          <p className="max-w-sm text-base font-light leading-relaxed text-beige/70">{materials.intro}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 md:mt-20">
          <div
            role="radiogroup"
            aria-label="Materials"
            className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2.5 overflow-x-auto px-5 pb-3 sm:scroll-px-8 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0"
          >
            {materials.items.map((m) => {
              const selected = m.id === active;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setActive(m.id)}
                  className={`group relative h-64 shrink-0 snap-start overflow-hidden text-left transition-[flex-grow,width] duration-700 ease-calm sm:h-80 lg:w-auto lg:flex-1 ${
                    selected ? "w-56 lg:grow-[3.2]" : "w-28 lg:grow"
                  }`}
                >
                  <span aria-hidden="true" className={`swatch swatch-${m.id} absolute inset-0 transition-transform duration-[1600ms] ease-calm group-hover:scale-[1.06]`} />
                  <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 border transition-colors duration-500 ${selected ? "border-gold" : "border-transparent"}`}
                  />
                  <span className="absolute inset-x-4 bottom-4 block">
                    <span className="block font-serif text-xl font-light lowercase leading-tight text-beige">{m.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 min-h-48 border-t border-gold/20 pt-8" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="grid gap-8 md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <p className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-light lowercase leading-tight text-beige">
                  {material.name}
                </p>
                <p className="mt-4 max-w-md text-base font-light leading-relaxed text-beige/70">{material.note}</p>
              </div>
              <div className="md:col-span-4 md:col-start-7">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">Where we use it</p>
                <ul className="mt-4 space-y-2 text-[0.95rem] font-light text-beige/85">
                  {material.uses.map((use) => (
                    <li key={use} className="flex items-center gap-3">
                      <span aria-hidden="true" className="size-1 rounded-full bg-gold" />
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
              {example && (
                <div className="md:col-span-2 md:self-end md:text-right">
                  <Link
                    href={projectHref(example)}
                    className="group inline-flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.26em] text-gold transition-colors duration-500 hover:text-beige"
                  >
                    See it in {example.name}
                    <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
