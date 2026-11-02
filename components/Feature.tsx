"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Magnetic } from "./Magnetic";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { feature } from "@/lib/site";

export function Feature() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  // Parallax only starts after hydration, so the server and first client
  // render match; it stays off when the visitor prefers reduced motion.
  const [parallax, setParallax] = useState(false);
  useEffect(() => {
    setParallax(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section aria-labelledby="feature-title" className="bg-bottle">
      <div className="mx-auto grid max-w-360 items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-12 md:gap-8 md:py-36 lg:px-12 lg:py-44">
        <div ref={ref} className="relative aspect-[4/5] overflow-hidden md:col-span-6 lg:col-span-7 lg:aspect-[5/6]">
          <motion.div style={parallax ? { y } : undefined} className="absolute -inset-y-[10%] inset-x-0">
            <Photo slot="feature" sizes="(min-width: 768px) 55vw, 100vw" />
          </motion.div>
        </div>

        <Reveal className="md:col-span-6 md:pl-6 lg:col-span-5 lg:pl-12">
          <p className="eyebrow text-gold">{feature.eyebrow}</p>
          <SplitText
            id="feature-title"
            className="display mt-8 text-[clamp(2.4rem,5.5vw,4.75rem)]"
            text={feature.heading}
          />
          <p className="mt-8 max-w-md text-base font-light leading-relaxed text-beige/80 md:text-[1.05rem]">
            {feature.body}
          </p>
          <div className="mt-12">
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-4 border border-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-beige transition-colors duration-500 hover:bg-gold hover:text-ink"
              >
                {feature.cta}
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
