"use client";

import { useEffect, useRef, useState } from "react";
import { GoldParticles } from "./GoldParticles";

const DESKTOP = "/videos/logo-reveal.mp4";
const MOBILE = "/videos/logo-reveal-mobile.mp4";
const POSTER = "/videos/logo-reveal-poster.jpg";

/**
 * The logo animation as the hero's centrepiece, looping continuously in the
 * background (paused while scrolled out of view). Visitors with reduced motion
 * or data saver, or whose browser blocks autoplay, see the finished logo as a
 * still with gold particles (particles only without reduced motion) and a Play
 * button. Edges are masked (.hero-video in globals.css) so it melts into the page.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setCalm(reduce);
    if (reduce || saveData) {
      setStill(true);
      return;
    }
    const video = ref.current;
    if (!video) return;
    video.play().catch(() => setStill(true));
    // Save battery: only play while the hero is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // A click is permission to play, even where autoplay was blocked or motion is reduced.
  const play = () => {
    setStill(false);
    ref.current?.play().catch(() => setStill(true));
  };

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="hero-video relative left-1/2 aspect-video w-[135vw] max-w-[60rem] -translate-x-1/2 sm:w-[110vw] lg:max-w-[min(72rem,calc((100svh-15rem)*1.5))]"
      >
        <video
          ref={ref}
          muted
          playsInline
          loop
          preload="auto"
          onError={() => setStill(true)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={MOBILE} type="video/mp4" media="(max-width: 767px)" />
          <source src={DESKTOP} type="video/mp4" />
        </video>
        {still && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="" className="hero-video-hold absolute inset-0 h-full w-full object-cover" />
        )}
        {still && !calm && <GoldParticles className="hero-particles absolute inset-0 h-full w-full" />}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </noscript>
      </div>
      {still && (
        <button
          type="button"
          onClick={play}
          className="hero-particles absolute bottom-[18%] right-0 inline-flex items-center gap-2 px-2 py-2 text-[0.6rem] uppercase tracking-[0.28em] text-gold/60 transition-colors duration-500 hover:text-gold sm:right-[8%] lg:right-[18%]"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="1.3">
            <path d="M13.5 8a5.5 5.5 0 1 1-1.8-4.1M13.5 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Play
        </button>
      )}
    </div>
  );
}
