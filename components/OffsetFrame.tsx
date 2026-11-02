"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * Gold outline that slides out from behind a photo when it scrolls into view.
 * Its resting offset comes from Tailwind `translate-*` classes, which use the
 * CSS `translate` property and so stack with this motion transform.
 */
export function OffsetFrame({ className = "", delay = 0.6 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute inset-0 border border-gold ${className}`}
      initial={{ x: -20, y: -20, opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.6, delay, ease: EASE }}
    />
  );
}
