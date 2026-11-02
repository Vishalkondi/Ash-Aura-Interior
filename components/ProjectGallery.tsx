"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { ImageReveal } from "./ImageReveal";
import { Lightbox, stepIndex, type LightboxItem } from "./Lightbox";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";

/** Photo grid for a project page; each photo opens in the lightbox. */
export function ProjectGallery({ items }: { items: LightboxItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const close = useCallback(() => setActive(null), []);
  const step = useCallback((dir: 1 | -1) => setActive((i) => stepIndex(i, dir, items.length)), [items.length]);
  const single = items.length === 1;

  return (
    <>
      <ul className={`grid gap-6 md:gap-10 ${single ? "" : "sm:grid-cols-2"}`}>
        {items.map((item, i) => (
          <li key={item.src + i} className={single ? "mx-auto w-full max-w-3xl" : i % 3 === 0 ? "sm:col-span-2" : ""}>
            <Reveal y={40} duration={1.4}>
              <Tilt
                max={3}
                className={`group relative overflow-hidden ${single || i % 3 !== 0 ? "aspect-[4/5]" : "aspect-[16/10]"}`}
              >
                <ImageReveal>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={single ? "(min-width: 768px) 48rem, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-[2400ms] ease-calm group-hover:scale-[1.05]"
                  />
                </ImageReveal>
                <button
                  type="button"
                  data-cursor="view"
                  aria-label={`Enlarge photo ${i + 1}: ${item.alt}`}
                  onClick={(e) => {
                    openerRef.current = e.currentTarget;
                    setActive(i);
                  }}
                  className="absolute inset-0 cursor-zoom-in focus-visible:outline-offset-[-6px]"
                />
              </Tilt>
            </Reveal>
          </li>
        ))}
      </ul>

      <AnimatePresence onExitComplete={() => openerRef.current?.focus()}>
        {active !== null && <Lightbox items={items} index={active} onClose={close} onStep={step} />}
      </AnimatePresence>
    </>
  );
}
