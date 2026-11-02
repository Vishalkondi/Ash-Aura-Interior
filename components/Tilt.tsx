"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees at the frame's edge. */
  max?: number;
};

const spring = { stiffness: 150, damping: 20, mass: 0.5 };

/**
 * Tips gently towards the pointer in 3D, with a soft light that follows it
 * across the surface (mouse only; still for reduced motion).
 */
export function Tilt({ children, className = "", max = 4 }: TiltProps) {
  const reduce = useReducedMotionSafe();
  // Pointer position across the frame, 0–1 on each axis.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useSpring(0, spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const lightX = useTransform(px, (v) => `${v * 100}%`);
  const lightY = useTransform(py, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(28rem circle at ${lightX} ${lightY}, rgb(232 220 200 / 0.16), transparent 60%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    hover.set(1);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ background: light, opacity: hover }}
      />
    </motion.div>
  );
}
