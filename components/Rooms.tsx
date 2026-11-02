"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { ScrollLine } from "./ScrollLine";
import { SplitText } from "./SplitText";
import { contact, getProject, projectHref, rooms } from "@/lib/site";
import { EASE } from "@/lib/motion";

/** Tabs for each kind of room: a photo, what we design there and a WhatsApp button to plan it. */
export function Rooms() {
  const id = useId();
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const room = rooms.items[index];
  const example = room.project ? getProject(room.project) : undefined;
  const whatsapp = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    `Hello Aishwarya, I'd like to plan my ${room.label.toLowerCase()} with Ash Aura Interiors.`,
  )}`;

  // Arrow keys move between tabs, as in a native tab list.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = rooms.items.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="relative bg-ink-soft">
      <ScrollLine />
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <Reveal>
          <p className="eyebrow text-gold">{rooms.eyebrow}</p>
          <SplitText id="rooms-title" className="display mt-8 text-[clamp(2.4rem,6vw,5rem)]" text={rooms.heading} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 md:mt-16">
          <div
            role="tablist"
            aria-label="Rooms"
            onKeyDown={onKeyDown}
            className="-mx-5 flex gap-1 overflow-x-auto border-b border-gold/20 px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
          >
            {rooms.items.map((r, i) => {
              const selected = i === index;
              return (
                <button
                  key={r.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`${id}-tab-${r.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={`relative shrink-0 px-4 pb-4 pt-2 text-[0.68rem] uppercase tracking-[0.26em] transition-colors duration-500 sm:px-5 ${
                    selected ? "text-beige" : "text-beige/50 hover:text-beige/80"
                  }`}
                >
                  {r.label}
                  {selected && (
                    <motion.span
                      layoutId={`${id}-tab-line`}
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-px bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${room.id}`}
          className="mt-10 md:mt-14"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={room.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8"
            >
              <motion.div
                className="relative aspect-[4/3] overflow-hidden md:col-span-7"
                style={{ backgroundColor: room.tone }}
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                {room.photo ? (
                  <Image
                    src={room.photo.src}
                    alt={room.photo.alt}
                    fill
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  // No photo yet: a quiet panel with the room name.
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span aria-hidden="true" className="absolute inset-5 border border-gold/20" />
                    <span className="font-serif text-[clamp(3rem,8vw,6rem)] font-light lowercase text-beige/25">
                      {room.label}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="md:col-span-4 md:col-start-9"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              >
                <h3 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light lowercase leading-tight text-beige">
                  {room.heading}
                </h3>
                <p className="mt-5 text-base font-light leading-relaxed text-beige/70">{room.body}</p>
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {room.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm font-light text-beige/85">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-gold px-6 py-3.5 text-[0.66rem] uppercase tracking-[0.26em] text-ink transition-colors duration-500 hover:bg-beige"
                  >
                    <WhatsAppIcon />
                    Plan my {room.label.toLowerCase()}
                    <span className="sr-only">(opens WhatsApp in a new tab)</span>
                  </a>
                  {example && (
                    <Link
                      href={projectHref(example)}
                      className="group inline-flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.26em] text-gold transition-colors duration-500 hover:text-beige"
                    >
                      See the project
                      <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
