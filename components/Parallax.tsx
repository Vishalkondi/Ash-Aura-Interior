"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";

type ParallaxProps = {
  children: React.ReactNode;
  /** Classes for the clipping frame, which sets the size and aspect ratio. */
  className?: string;
  /** How far the image drifts each way, as a percentage of the frame height. */
  distance?: number;
};

/** Photo frame whose contents drift more slowly than the page as it scrolls past. */
export function Parallax({ children, className = "", distance = 8 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Taller than the frame so the drift never shows an edge. */}
      <motion.div
        className="absolute inset-x-0"
        style={{ top: `-${distance + 2}%`, bottom: `-${distance + 2}%`, ...(reduce ? {} : { y }) }}
      >
        {children}
      </motion.div>
    </div>
  );
}
