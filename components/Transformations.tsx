"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BeforeAfter } from "./BeforeAfter";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { projectHref, transformationProjects, transformations } from "@/lib/site";
import { EASE } from "@/lib/motion";

/**
 * Before/after sliders for the projects that have a real pair of photos, with
 * a project switcher when there is more than one. Hidden until there is one.
 */
export function Transformations() {
  const [index, setIndex] = useState(0);
  const project = transformationProjects[index];
  if (!project?.beforeAfter) return null;

  return (
    <section id="transformations" aria-labelledby="transformations-title" className="on-light bg-beige text-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold-deep">{transformations.eyebrow}</p>
            <SplitText
              id="transformations-title"
              className="display mt-8 text-[clamp(2.6rem,7vw,6rem)]"
              text={transformations.heading}
            />
          </div>
          <p className="max-w-sm text-base font-light leading-relaxed text-ink/75">{transformations.body}</p>
        </Reveal>

        {transformationProjects.length > 1 && (
          <div role="group" aria-label="Choose a project" className="mt-12 flex flex-wrap gap-2.5 md:mt-16">
            {transformationProjects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
                className={`border px-5 py-2.5 text-[0.66rem] uppercase tracking-[0.24em] transition-colors duration-500 ${
                  i === index ? "border-ink bg-ink text-beige" : "border-ink/25 text-ink/75 hover:border-ink"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 md:mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <BeforeAfter {...project.beforeAfter} />
              <Link
                href={projectHref(project)}
                className="group mt-6 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.26em] text-gold-deep transition-colors duration-500 hover:text-ink"
              >
                See {project.name}
                <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
