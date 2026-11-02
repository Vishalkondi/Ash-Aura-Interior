"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * Renders "8+ years" style values, counting the leading number up from zero
 * when it scrolls into view. The server renders the final value.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const target = match ? Number(match[1]) : 0;
  const hasNumber = match !== null;

  useEffect(() => {
    if (!hasNumber || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      ref.current.textContent = "0";
      return;
    }
    const controls = animate(0, target, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, hasNumber, target]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span className={className}>
      <span ref={ref} className="tabular-nums">
        {match[1]}
      </span>
      {match[2]}
    </span>
  );
}
