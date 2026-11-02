"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { areas, getProject, photos, projectHref } from "@/lib/site";
import { EASE } from "@/lib/motion";

const SIZE = 500;
// Degrees to map units; longitude is narrowed slightly for the latitude.
const SCALE = 2900;
const LAT_TOP = 18.69;
const LNG_LEFT = 73.715;
const point = (lat: number, lng: number) => ({
  x: 70 + (lng - LNG_LEFT) * SCALE * 0.95,
  y: 60 + (LAT_TOP - lat) * SCALE,
});

const placed = areas.items.map((area) => ({
  ...area,
  ...point(area.lat, area.lng),
  example: area.project ? getProject(area.project) : undefined,
}));
// Rings centre on the middle of the served areas.
const centre = {
  x: placed.reduce((sum, a) => sum + a.x, 0) / placed.length,
  y: placed.reduce((sum, a) => sum + a.y, 0) / placed.length,
};

/**
 * A stylised map of PCMC and west Pune with a pin for each area we serve.
 * Areas with a finished project preview it on hover or focus and link to it.
 */
export function AreasMap() {
  const [active, setActive] = useState<string | null>(null);
  const current = placed.find((a) => a.name === active);

  return (
    <section id="areas" aria-labelledby="areas-title" className="on-light bg-beige text-ink">
      <div className="mx-auto grid max-w-360 gap-12 px-5 py-24 sm:px-8 md:grid-cols-12 md:items-center md:gap-8 md:py-36 lg:px-12">
        <Reveal className="md:col-span-5">
          <p className="eyebrow text-gold-deep">{areas.eyebrow}</p>
          <SplitText id="areas-title" className="display mt-8 text-[clamp(2.4rem,6vw,5rem)]" text={areas.heading} />
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-ink/75">{areas.body}</p>

          <ul className="mt-10 grid grid-cols-2 border-t border-ink/15" onPointerLeave={() => setActive(null)}>
            {placed.map((area) => {
              const label = (
                <>
                  <span
                    aria-hidden="true"
                    className={`size-2 shrink-0 rounded-full border border-gold-deep transition-colors duration-500 ${
                      area.example || active === area.name ? "bg-gold-deep" : ""
                    }`}
                  />
                  <span>{area.name}</span>
                  {area.example && (
                    <span aria-hidden="true" className="ml-auto text-gold-deep transition-transform duration-500 ease-calm group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </>
              );
              const className = `group flex w-full items-center gap-3 py-3 pr-3 text-[0.95rem] font-light transition-colors duration-500 ${
                active === area.name ? "text-ink" : "text-ink/70"
              }`;
              const focus = {
                onPointerEnter: () => setActive(area.name),
                onFocus: () => setActive(area.name),
                onBlur: () => setActive(null),
              };
              return (
                <li key={area.name} className="border-b border-ink/15">
                  {area.example ? (
                    <Link href={projectHref(area.example)} className={className} {...focus}>
                      {label}
                      <span className="sr-only">: see {area.example.name}</span>
                    </Link>
                  ) : (
                    <span className={className} onPointerEnter={focus.onPointerEnter}>
                      {label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.26em] text-ink/55">
            <span aria-hidden="true" className="size-2 rounded-full bg-gold-deep" /> Completed project
            <span aria-hidden="true" className="ml-4 size-2 rounded-full border border-gold-deep" /> Area we serve
          </p>
        </Reveal>

        <Reveal delay={0.2} className="relative md:col-span-7">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Map of the areas we serve: ${areas.items.map((a) => a.name).join(", ")}`}
            className="h-auto w-full"
          >
            {/* survey grid */}
            {Array.from({ length: 9 }, (_, i) => (i + 1) * (SIZE / 10)).map((v) => (
              <g key={v} className="stroke-ink/[0.07]" strokeWidth="1">
                <line x1={v} y1="0" x2={v} y2={SIZE} />
                <line x1="0" y1={v} x2={SIZE} y2={v} />
              </g>
            ))}
            {/* rings around the area we cover */}
            {[70, 140, 210].map((r, i) => (
              <motion.circle
                key={r}
                cx={centre.x}
                cy={centre.y}
                r={r}
                fill="none"
                className="stroke-gold-deep/30"
                strokeWidth="1"
                strokeDasharray={i === 2 ? "2 6" : undefined}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, delay: 0.2 * i, ease: EASE }}
              />
            ))}
            {/* north marker */}
            <g className="fill-ink/45 text-[11px]" transform={`translate(${SIZE - 34} 40)`}>
              <path d="M0 -14 L5 4 L0 0 L-5 4 Z" />
              <text y="20" textAnchor="middle" className="fill-ink/45 font-sans tracking-[0.2em]">N</text>
            </g>

            {placed.map((area, i) => {
              const on = active === area.name;
              return (
                <motion.g
                  key={area.name}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + 0.07 * i, ease: EASE }}
                  style={{ transformOrigin: `${area.x}px ${area.y}px` }}
                  onPointerEnter={() => setActive(area.name)}
                  onPointerLeave={() => setActive(null)}
                  className="cursor-default"
                >
                  {area.example && (
                    <circle cx={area.x} cy={area.y} r="14" className="area-pulse fill-gold-deep/15" />
                  )}
                  <circle
                    cx={area.x}
                    cy={area.y}
                    r={on ? 7 : 5}
                    className={`transition-all duration-500 ${
                      area.example || on ? "fill-gold-deep" : "fill-beige"
                    } stroke-gold-deep`}
                    strokeWidth="1.5"
                  />
                  <text
                    x={area.x + 11}
                    y={area.y + 4}
                    className={`font-serif text-[15px] transition-colors duration-500 ${on ? "fill-ink" : "fill-ink/65"}`}
                  >
                    {area.name}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          {/* preview of the project in the highlighted area */}
          <AnimatePresence>
            {current?.example && (
              <motion.div
                key={current.name}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 w-40 bg-ink p-2 shadow-[0_20px_40px_rgba(0,0,0,0.25)] sm:w-52"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Image src={photos[current.example.slot]} alt="" fill sizes="13rem" className="object-cover" />
                </span>
                <span className="mt-2 block px-1 font-serif text-base font-light lowercase leading-tight text-beige">
                  {current.example.name}
                </span>
                <span className="mb-1 block px-1 text-[0.55rem] uppercase tracking-[0.22em] text-gold">
                  {current.name}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
