"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE } from "@/lib/motion";

type DrawLineProps = {
  /** Sets the line colour through `currentColor`, e.g. "text-gold/40". */
  className?: string;
  delay?: number;
  /** Pops an accent dot in at the start of the line. */
  dot?: boolean;
};

/** A hairline along the top of its parent that draws left to right when it scrolls into view. */
export function DrawLine({ className = "", delay = 0, dot = false }: DrawLineProps) {
  // Observe the unscaled wrapper: a line at scaleX(0) has no width to intersect.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <span ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px ${className}`}>
      <motion.span
        className="block h-full origin-left bg-current"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.4, delay, ease: EASE }}
      />
      {dot && (
        <motion.span
          className="absolute -top-0.5 left-0 size-1.25 rounded-full bg-accent"
          initial={{ scale: 0 }}
          animate={{ scale: inView ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 14, delay }}
        />
      )}
    </span>
  );
}
