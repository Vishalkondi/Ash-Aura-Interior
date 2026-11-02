"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE, useReducedMotionSafe } from "@/lib/motion";

type ImageRevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/** Curtain-style reveal: the frame opens upwards while the photo settles from a slight zoom. */
export function ImageReveal({ children, delay = 0, className = "" }: ImageRevealProps) {
  // Observe the unclipped wrapper: a fully clipped element has no visible
  // area, so the browser would never report it as in view.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotionSafe();
  const shown = inView || reduce;

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: shown ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
        transition={{ duration: reduce ? 0 : 1.6, delay: reduce ? 0 : delay, ease: EASE }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.18 }}
          animate={{ scale: shown ? 1 : 1.18 }}
          transition={{ duration: reduce ? 0 : 2.2, delay: reduce ? 0 : delay, ease: EASE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
