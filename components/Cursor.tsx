"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE = "a, button, summary, label, input, textarea, [data-cursor]";

/**
 * A soft gold ring that trails the pointer on desktop. It grows over links and
 * shows a label (from `data-cursor`) over elements such as project photos.
 * The native cursor stays visible; nothing renders on touch devices or when
 * the visitor prefers reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHover(!!target?.closest(INTERACTIVE));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 88 : hover ? 44 : 14;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-80 flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        backgroundColor: label ? "rgba(184,149,106,0.92)" : "rgba(184,149,106,0)",
        borderColor: label ? "rgba(184,149,106,0)" : "rgba(184,149,106,0.8)",
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="absolute inset-0 rounded-full border border-inherit" style={{ borderColor: "inherit" }} />
      <AnimatePresence>
        {label && (
          <motion.span
            className="text-[0.6rem] uppercase tracking-[0.28em] text-ink"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
