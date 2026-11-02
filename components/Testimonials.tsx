"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import type { Testimonial } from "@/lib/site";
import { EASE } from "@/lib/motion";

/** One quote at a time, with arrows, dots and swipe. Renders nothing without testimonials. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  if (items.length === 0) return null;

  const many = items.length > 1;
  const go = (d: 1 | -1) => {
    setDir(d);
    setIndex((i) => (i + d + items.length) % items.length);
  };
  const t = items[index];

  return (
    <section aria-labelledby="testimonials-title" className="bg-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <Reveal className="text-center">
          <p className="eyebrow justify-center text-gold before:hidden sm:before:block">Kind words</p>
          <SplitText
            id="testimonials-title"
            text="from our clients"
            className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)]"
          />
        </Reveal>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          className="relative mx-auto mt-14 max-w-4xl md:mt-20"
          onKeyDown={(e) => {
            if (!many) return;
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          <div aria-live="polite" className="relative min-h-[18rem] overflow-hidden sm:min-h-[16rem]">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${items.length}`}
                className="cursor-grab text-center active:cursor-grabbing"
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: EASE }}
                drag={many ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
              >
                <span aria-hidden="true" className="block font-serif text-7xl leading-none text-gold/60">
                  “
                </span>
                <blockquote className="mt-2 font-serif text-[clamp(1.5rem,3.2vw,2.4rem)] font-light italic leading-snug text-beige/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-10 flex items-center justify-center gap-4">
                  {t.photo && (
                    <span className="relative size-12 overflow-hidden rounded-full border border-gold/40">
                      <Image src={t.photo} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                  )}
                  <span className="text-left">
                    <span className="block font-serif text-xl text-beige">{t.name}</span>
                    <span className="block text-[0.62rem] uppercase tracking-[0.3em] text-gold">{t.area}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {many && (
            <div className="mt-10 flex items-center justify-center gap-6">
              <CarouselButton label="Previous testimonial" dir={-1} onClick={() => go(-1)} />
              <div className="flex gap-2.5">
                {items.map((item, i) => (
                  <button
                    key={item.name + i}
                    type="button"
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => {
                      setDir(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className="flex size-6 items-center justify-center"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-500 ${
                        i === index ? "w-6 bg-gold" : "w-1.5 bg-beige/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <CarouselButton label="Next testimonial" dir={1} onClick={() => go(1)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CarouselButton({ label, dir, onClick }: { label: string; dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-12 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
