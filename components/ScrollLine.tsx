"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

/** A gold rule that draws from left to right as its parent scrolls through the viewport. */
export function ScrollLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 35%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px ${className}`}>
      <motion.div className="h-px origin-left bg-gold" style={{ scaleX }} />
    </div>
  );
}
