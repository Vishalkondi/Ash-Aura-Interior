"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { captureLeadSource } from "@/lib/leadSource";
import { registerLenis } from "@/lib/scroll";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => captureLeadSource(), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: true,
    });
    registerLenis(lenis);
    // An overlay (the intro video) may have locked scrolling before smooth scroll started.
    if (document.documentElement.classList.contains("lenis-stopped")) lenis.stop();

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
