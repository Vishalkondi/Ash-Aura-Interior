"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";

/**
 * Round button above the floating WhatsApp button (md and up) that returns to
 * the top. Its ring fills with gold as the page is read. Smooth scrolling of
 * the #top link is handled by Lenis.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      tabIndex={visible ? undefined : -1}
      aria-hidden={!visible || undefined}
      className={`group fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.5rem)] right-6 z-40 flex size-12 items-center justify-center rounded-full bg-ink/80 text-gold backdrop-blur-sm transition-[opacity,transform,color] duration-700 ease-calm hover:text-beige sm:right-9 max-md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
        <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
        <motion.circle
          cx="24"
          cy="24"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="relative size-4 transition-transform duration-500 ease-calm group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
