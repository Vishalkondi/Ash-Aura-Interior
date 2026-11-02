"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { EASE } from "@/lib/motion";

const DESKTOP = "/videos/logo-reveal.mp4";
const MOBILE = "/videos/logo-reveal-mobile.mp4";

/** Longest the intro may stay up, in case the video stalls. */
const MAX_MS = 14000;

/**
 * Inline script for the page <head>: decides before first paint whether the
 * intro plays (first home-page visit in this tab, motion and data allowed).
 * The overlay is only visible while <html data-intro="play">.
 */
export const introScript = `try{var d=document.documentElement,c=navigator.connection;if(matchMedia("(prefers-reduced-motion: reduce)").matches||(c&&c.saveData)||sessionStorage.getItem("ash-intro"))d.dataset.intro="skip";else{d.dataset.intro="play";sessionStorage.setItem("ash-intro","1")}}catch(e){document.documentElement.dataset.intro="skip"}`;

/**
 * The logo animation full-screen, once per visit, before the home page. Skip
 * with the button, a click or Escape. When it ends the hero is already holding
 * the finished logo (HeroVideo), so the two join up seamlessly.
 */
export function VideoIntro() {
  const [show, setShow] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "play") {
      setShow(false);
      return;
    }
    lockScroll();
    skipRef.current?.focus();
    const finish = () => setShow(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    const timer = window.setTimeout(finish, MAX_MS);
    window.addEventListener("keydown", onKey);
    // Autoplay blocked: go straight to the site.
    ref.current?.play().catch(finish);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.dataset.intro = "done";
        unlockScroll();
      }}
    >
      {show && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Ash Aura Interiors intro"
          className="video-intro fixed inset-0 z-80 flex cursor-pointer items-center justify-center bg-ink"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: EASE } }}
          onClick={() => setShow(false)}
        >
          <video
            ref={ref}
            muted
            playsInline
            preload="auto"
            onEnded={() => setShow(false)}
            onError={() => setShow(false)}
            className="h-full w-full max-w-[90rem] object-contain"
          >
            <source src={MOBILE} type="video/mp4" media="(max-width: 767px)" />
            <source src={DESKTOP} type="video/mp4" />
          </video>
          <button
            ref={skipRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
            }}
            className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 px-3 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-beige/60 transition-colors duration-500 hover:text-gold sm:right-8"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
