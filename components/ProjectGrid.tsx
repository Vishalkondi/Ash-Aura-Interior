"use client";

import { useCallback, useRef, useState, ViewTransition } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ImageReveal } from "./ImageReveal";
import { Lightbox, stepIndex, type LightboxItem } from "./Lightbox";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";
import { EASE } from "@/lib/motion";
import { photoDetails, photos, projectHref, type Project } from "@/lib/site";

const ALL = "All";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState(ALL);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  // Only categories that have projects to show; the filter stays hidden until there are two.
  const categories = [...new Set(projects.map((p) => p.category))];
  const shown = filter === ALL ? projects : projects.filter((p) => p.category === filter);

  const open = (i: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setActive(i);
  };
  const close = useCallback(() => setActive(null), []);
  const step = useCallback((dir: 1 | -1) => setActive((i) => stepIndex(i, dir, shown.length)), [shown.length]);
  const items: LightboxItem[] = shown.map((p) => ({
    src: photos[p.slot],
    alt: photoDetails[p.slot].alt,
    title: p.name,
    subtitle: p.type,
  }));

  return (
    <>
      {categories.length > 1 && (
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 md:mt-20">
          <LayoutGroup id="project-filter">
            <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-x-7 gap-y-2">
              {[ALL, ...categories].map((category) => {
                const selected = filter === category;
                const count = category === ALL ? projects.length : projects.filter((p) => p.category === category).length;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(category)}
                    className={`relative py-2 text-[0.72rem] uppercase tracking-[0.28em] transition-colors duration-500 ${
                      selected ? "text-beige" : "text-beige/55 hover:text-beige"
                    }`}
                  >
                    {category}
                    <sup className="ml-1 font-serif text-[0.8rem] normal-case tracking-normal text-gold">{count}</sup>
                    {selected && (
                      <motion.span
                        layoutId="filter-underline"
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px bg-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <p aria-live="polite" className="sr-only">
            Showing {shown.length} {filter === ALL ? "" : filter.toLowerCase()} projects
          </p>
        </div>
      )}

      <motion.ul
        layout
        className={`grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-12 md:gap-y-24 lg:gap-x-12 ${
          categories.length > 1 ? "mt-12 md:mt-16" : "mt-16 md:mt-24"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, i) => (
            <motion.li
              key={project.slot}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: EASE }}
              className={`${project.grid} ${i % 2 === 1 ? "sm:max-md:mt-16" : ""}`}
            >
              <Reveal y={48} duration={1.4}>
                <figure className="group @container">
                  <Tilt className={`relative overflow-hidden ${project.aspect}`}>
                    {/* Shares a name with the project page hero, so the photo grows into it. */}
                    <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                      <ImageReveal>
                        <Photo
                          slot={project.slot}
                          sizes="(min-width: 768px) 60vw, (min-width: 640px) 50vw, 100vw"
                          imageClassName="transition-transform duration-[2400ms] ease-calm group-hover:scale-[1.06]"
                        />
                      </ImageReveal>
                    </ViewTransition>
                    <button
                      type="button"
                      onClick={(e) => open(i, e.currentTarget)}
                      aria-label={`View ${project.name}, ${project.type}`}
                      data-cursor="view"
                      className="absolute inset-0 flex cursor-zoom-in items-end justify-end p-4 focus-visible:outline-offset-[-6px]"
                    >
                      <span
                        aria-hidden="true"
                        className="translate-y-2 bg-ink/80 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-beige opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-700 ease-calm group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        View
                      </span>
                    </button>
                  </Tilt>
                  <figcaption className="mt-5 flex flex-col gap-2 border-t border-gold/25 pt-4 @xl:flex-row @xl:items-baseline @xl:justify-between @xl:gap-6">
                    <Link
                      href={projectHref(project)}
                      className="group/link inline-flex items-baseline gap-3 font-serif text-2xl font-light lowercase leading-tight text-beige transition-colors duration-500 hover:text-gold md:text-[1.75rem]"
                    >
                      {project.name}
                      <span
                        aria-hidden="true"
                        className="text-base text-gold transition-transform duration-500 ease-calm group-hover/link:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                    <span className="text-[0.65rem] uppercase tracking-[0.22em] text-gold @xl:shrink-0 @xl:text-right">
                      {project.type}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence
        onExitComplete={() => {
          openerRef.current?.focus();
        }}
      >
        {active !== null && <Lightbox items={items} index={active} onClose={close} onStep={step} />}
      </AnimatePresence>
    </>
  );
}
