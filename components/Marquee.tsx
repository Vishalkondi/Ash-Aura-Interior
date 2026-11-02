"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { marquee } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/motion";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marquee.map((word) => (
        <li key={word} className="flex items-center">
          <span className="px-6 font-serif text-[clamp(1.75rem,4vw,3rem)] font-light italic lowercase text-gold md:px-10">
            {word}
          </span>
          <svg viewBox="0 0 10 10" className="size-2.5 shrink-0 fill-gold/70" aria-hidden="true">
            <path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Slow drift that speeds up, and reverses, with the visitor's scroll. */
export function Marquee() {
  const reduce = useReducedMotionSafe();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce || paused.current) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    baseX.set(baseX.get() - direction.current * 1.2 * (delta / 1000) * (1 + Math.abs(b)));
  });

  return (
    <section
      aria-label="What we work on"
      className="overflow-hidden border-y border-gold/25 bg-ink py-6 md:py-8"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <motion.div className="flex w-max" style={{ x }}>
        <Row />
        <Row hidden />
      </motion.div>
    </section>
  );
}
