"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { lockScroll, unlockScroll } from "@/lib/scroll";

export type LightboxItem = {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
};

type LightboxProps = {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
};

/** Full-screen photo viewer with arrow keys, swipe, Escape and a focus trap. */
export function Lightbox({ items, index, onClose, onStep }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const item = items[index];
  const total = items.length;
  const many = total > 1;

  useEffect(() => {
    lockScroll();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) onStep(1);
      else if (e.key === "ArrowLeft" && many) onStep(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        // keep focus inside the dialog
        const buttons = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose, onStep, many]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, photo ${index + 1} of ${total}`}
      data-lenis-prevent
      className="fixed inset-0 z-[60] flex flex-col bg-ink/96 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null || !many) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="relative flex size-11 items-center justify-center text-beige transition-colors duration-500 hover:text-gold"
        >
          <span className="absolute h-px w-6 rotate-45 bg-current" />
          <span className="absolute h-px w-6 -rotate-45 bg-current" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-5 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.src + index}
            className="pointer-events-none relative h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>

        {many && (
          <>
            <ArrowButton dir={-1} onClick={() => onStep(-1)} />
            <ArrowButton dir={1} onClick={() => onStep(1)} />
          </>
        )}
      </div>

      <div className="px-5 pb-6 pt-5 text-center sm:px-8 sm:pb-8">
        <p className="font-serif text-2xl font-light lowercase text-beige sm:text-3xl">{item.title}</p>
        {item.subtitle && (
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.24em] text-gold">{item.subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Next photo" : "Previous photo"}
      className={`absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink max-sm:hidden ${
        dir === 1 ? "right-4 lg:right-8" : "left-4 lg:left-8"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Index state for a lightbox over `count` items. */
export function stepIndex(i: number | null, dir: 1 | -1, count: number) {
  return i === null ? i : (i + dir + count) % count;
}
