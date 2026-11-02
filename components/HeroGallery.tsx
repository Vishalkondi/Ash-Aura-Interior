"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ImageReveal } from "./ImageReveal";
import { Photo } from "./Photo";
import { photoDetails, photos, projectHref, visibleProjects, type PhotoSlot } from "@/lib/site";
import { EASE, useReducedMotionSafe } from "@/lib/motion";

const frames: { slot: PhotoSlot; className: string; delay: number; drift: number }[] = [
  { slot: "hero-1", className: "md:mt-24", delay: 0.3, drift: -40 },
  { slot: "hero-2", className: "mt-10 md:mt-0", delay: 0.5, drift: -110 },
  { slot: "hero-3", className: "mt-20 md:mt-40", delay: 0.7, drift: -70 },
];

/** The project a hero photo comes from, matched by its file, so the caption can link to it. */
const projectFor = (slot: PhotoSlot) => visibleProjects.find((p) => photos[p.slot] === photos[slot]);

/** Three staggered photos that unveil in turn, then drift at different speeds on scroll. */
export function HeroGallery() {
  const reduce = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const y0 = useTransform(scrollY, [0, 900], [0, reduce ? 0 : frames[0].drift]);
  const y1 = useTransform(scrollY, [0, 900], [0, reduce ? 0 : frames[1].drift]);
  const y2 = useTransform(scrollY, [0, 900], [0, reduce ? 0 : frames[2].drift]);
  const ys = [y0, y1, y2];

  return (
    <div className="mt-14 grid grid-cols-3 gap-2.5 sm:gap-5 md:mt-20 md:gap-8 lg:gap-12">
      {frames.map(({ slot, className, delay }, i) => {
        const project = projectFor(slot);
        const caption = (
          <>
            <span className="font-serif text-sm italic text-gold">0{i + 1}</span>
            <span className="truncate">{photoDetails[slot].label}</span>
            {project && (
              <span
                aria-hidden="true"
                className="ml-auto text-gold transition-transform duration-500 ease-calm group-hover:translate-x-1 max-sm:hidden"
              >
                →
              </span>
            )}
          </>
        );
        const captionClass =
          "group mt-3 flex items-baseline gap-2.5 border-t border-gold/20 pt-3 text-[0.55rem] uppercase tracking-[0.22em] text-beige/60 transition-colors duration-500 hover:text-beige sm:text-[0.62rem] md:mt-4";

        return (
          <motion.div key={slot} className={className} style={{ y: ys[i] }}>
            <div className="relative aspect-[3/4] overflow-hidden">
              <ImageReveal delay={delay}>
                <Photo slot={slot} priority sizes="(min-width: 768px) 30vw, 33vw" />
              </ImageReveal>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: delay + 0.9, ease: EASE }}
            >
              {project ? (
                <Link href={projectHref(project)} className={captionClass} aria-label={`${photoDetails[slot].label}: see ${project.name}`}>
                  {caption}
                </Link>
              ) : (
                <p className={captionClass}>{caption}</p>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
