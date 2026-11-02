"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type { ProjectImage } from "@/lib/site";

type BeforeAfterProps = {
  before: ProjectImage;
  after: ProjectImage;
  caption?: string;
};

/**
 * Drag, swipe or use the arrow keys to compare two photos. The control is a
 * native range input stretched over the image, so mouse, touch and keyboard
 * all work without extra handlers.
 */
export function BeforeAfter({ before, after, caption }: BeforeAfterProps) {
  const [value, setValue] = useState(50);
  const id = useId();

  return (
    <figure>
      <div className="relative aspect-[4/3] select-none overflow-hidden bg-ink sm:aspect-[16/10]">
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover" />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 bg-ink/75 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-beige backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 bg-ink/75 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-beige backdrop-blur-sm">
          After
        </span>

        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Compare before and after"
          aria-valuetext={`${value}% before, ${100 - value}% after`}
          className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />

        {/* divider and handle, positioned at the slider value */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-beige"
          style={{ left: `${value}%` }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-beige bg-ink/70 text-beige backdrop-blur-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold"
          style={{ left: `${value}%` }}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {caption && <figcaption className="mt-5 text-sm font-light text-ink/70">{caption}</figcaption>}
    </figure>
  );
}
