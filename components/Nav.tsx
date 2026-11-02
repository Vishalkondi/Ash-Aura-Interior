"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { LogoMark } from "./Logo";
import { Magnetic } from "./Magnetic";
import { contact, nav, photos, projectHref, visibleProjects } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll";

/** Section the visitor is reading, from the in-page links in `nav` (home page only). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const ids = ["top", ...nav.filter((item) => item.href.startsWith("#")).map((item) => item.href.slice(1))];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    // A thin band across the middle of the screen decides which section is current.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : `#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  // Desktop preview of recent projects, opened from the Projects link.
  const [showWork, setShowWork] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  // Section links are in-page on the home page and point back to it elsewhere.
  const pathname = usePathname();
  const home = pathname === "/";
  // Page links such as /journal are left as they are.
  const link = (href: string) => (home || !href.startsWith("#") ? href : `/${href}`);
  const section = useActiveSection(home);
  const active = nav.find((item) => !item.href.startsWith("#") && pathname.startsWith(item.href))?.href ?? section;
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Unlock synchronously so the smooth-scroll anchor jump isn't blocked.
  const closeMenu = () => {
    unlockScroll();
    setOpen(false);
  };

  // Solid once the page moves; tucks away while scrolling down, returns on the way up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setTucked(y > previous && y > 320);
  });

  useEffect(() => setScrolled(window.scrollY > 40), []);

  useEffect(() => {
    if (!showWork) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowWork(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showWork]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const close = () => window.innerWidth >= 1024 && setOpen(false);
    lockScroll();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const hidden = tucked && !open;

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-calm ${
          scrolled || open || showWork
            ? "border-b border-gold/15 bg-ink/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        onFocusCapture={() => setTucked(false)}
        onPointerLeave={() => setShowWork(false)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setShowWork(false);
        }}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-360 items-center justify-between gap-6 px-5 sm:px-8 md:h-20 lg:px-12"
        >
          <a href={home ? "#top" : "/"} className="group flex items-center gap-3" onClick={closeMenu}>
            <LogoMark className="size-8 text-gold transition-transform duration-700 ease-calm group-hover:rotate-[20deg] md:size-9" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[1.4rem] font-normal tracking-[0.01em] text-beige transition-colors duration-500 group-hover:text-gold md:text-[1.55rem]">
                Ash Aura
              </span>
              <span className="mt-1 text-[0.5rem] font-normal tracking-[0.48em] text-gold">INTERIORS</span>
            </span>
          </a>

          <ul className="flex items-center max-lg:hidden" onPointerLeave={() => setHovered(null)}>
            {nav.map((item) => {
              const current = active === item.href;
              return (
                <li key={item.href} className="relative">
                  <a
                    href={link(item.href)}
                    aria-current={current ? "location" : undefined}
                    onPointerEnter={() => {
                      setHovered(item.href);
                      setShowWork(item.href === "#projects");
                    }}
                    onFocus={() => {
                      setHovered(item.href);
                      setShowWork(item.href === "#projects");
                    }}
                    onBlur={() => setHovered(null)}
                    className={`relative isolate block px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.26em] transition-colors duration-500 xl:px-5 ${
                      current || hovered === item.href ? "text-beige" : "text-beige/65"
                    }`}
                  >
                    {hovered === item.href && (
                      <motion.span
                        layoutId="nav-hover"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 border border-gold/30 bg-gold/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                    {item.href === "#projects" && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 10 6"
                        className={`ml-2 inline-block h-1.5 w-2.5 fill-none stroke-gold transition-transform duration-500 ease-calm ${
                          showWork ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M1 1l4 4 4-4" />
                      </svg>
                    )}
                    {current && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={contact.phoneHref}
              aria-label={`Call ${contact.phoneDisplay}`}
              className="flex size-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink max-md:hidden"
            >
              <PhoneIcon />
            </a>
            <span className="inline-flex max-sm:hidden">
              <Magnetic strength={0.2}>
                <a
                  href={link("#book")}
                  onClick={closeMenu}
                  className="group relative inline-flex items-center gap-3 overflow-hidden bg-gold px-6 py-3.5 text-[0.66rem] uppercase tracking-[0.26em] text-ink"
                >
                  {/* beige wipe that rises on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-full bg-beige transition-transform duration-500 ease-calm group-hover:translate-y-0"
                  />
                  <span className="relative">Book a consultation</span>
                  <span
                    aria-hidden="true"
                    className="relative transition-transform duration-500 ease-calm group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </Magnetic>
            </span>

            <button
              type="button"
              className="group relative -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="block text-[0.62rem] uppercase tracking-[0.3em] text-beige/80 max-sm:hidden">
                {open ? "Close" : "Menu"}
              </span>
              <span aria-hidden="true" className="relative flex size-6 items-center justify-center">
                <span
                  className={`absolute h-px bg-beige transition-[transform,width] duration-500 ease-calm ${
                    open ? "w-6 rotate-45" : "w-6 -translate-y-1"
                  }`}
                />
                <span
                  className={`absolute right-0 h-px bg-gold transition-[transform,width] duration-500 ease-calm ${
                    open ? "w-6 -rotate-45" : "w-4 translate-y-1 group-hover:w-6"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {showWork && (
            <motion.div
              className="absolute inset-x-0 top-full border-b border-gold/15 bg-ink max-lg:hidden"
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.4, ease: EASE } }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="mx-auto flex max-w-360 gap-10 px-12 py-10">
                <div className="flex w-60 shrink-0 flex-col justify-between">
                  <div>
                    <p className="eyebrow text-gold">Selected work</p>
                    <p className="mt-5 font-serif text-[1.6rem] font-light leading-snug text-beige">
                      Homes and workplaces across PCMC and Pune.
                    </p>
                  </div>
                  <a
                    href={link("#projects")}
                    onClick={() => setShowWork(false)}
                    className="group inline-flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.26em] text-gold transition-colors duration-500 hover:text-beige"
                  >
                    View all projects
                    <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
                <ul className="grid flex-1 grid-cols-5 gap-5">
                  {visibleProjects.slice(0, 5).map((project, i) => (
                    <motion.li
                      key={project.slug}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.12 + 0.06 * i, ease: EASE }}
                    >
                      <Link href={projectHref(project)} onClick={() => setShowWork(false)} className="group block">
                        <span className="relative block aspect-[4/5] overflow-hidden">
                          <Image
                            src={photos[project.slot]}
                            alt=""
                            fill
                            sizes="14rem"
                            className="object-cover transition-transform duration-[1600ms] ease-calm group-hover:scale-[1.08]"
                          />
                        </span>
                        <span className="mt-3 block font-serif text-lg font-light lowercase leading-tight text-beige transition-colors duration-500 group-hover:text-gold">
                          {project.name}
                        </span>
                        <span className="mt-1 block text-[0.56rem] uppercase tracking-[0.22em] text-gold/80">
                          {project.location}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-gold"
        />
      </motion.header>

      {/* Outside the header: its slide transform would trap a fixed overlay inside the bar. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-ink px-5 pb-10 pt-8 sm:px-8 md:top-20 lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.6, delay: 0.15, ease: EASE } }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <ul className="flex flex-col">
              {nav.map((item, i) => {
                const current = active === item.href;
                return (
                  <li key={item.href} className="relative overflow-hidden border-b border-gold/15">
                    <motion.a
                      href={link(item.href)}
                      onClick={closeMenu}
                      aria-current={current ? "location" : undefined}
                      className={`group flex items-baseline gap-5 py-3 font-serif text-[clamp(2.5rem,11vw,4rem)] font-light lowercase leading-tight transition-colors duration-500 ${
                        current ? "text-gold" : "text-beige hover:text-gold"
                      }`}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%", transition: { duration: 0.4, ease: EASE } }}
                      transition={{ duration: 0.9, delay: 0.25 + 0.07 * i, ease: EASE }}
                    >
                      <span className="w-6 font-sans text-xs tracking-[0.2em] text-gold">0{i + 1}</span>
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="ml-auto -translate-x-3 self-center text-2xl text-gold opacity-0 transition-[opacity,transform] duration-500 ease-calm group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </motion.a>
                  </li>
                );
              })}
            </ul>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            >
              <p className="eyebrow text-gold">Recent work</p>
              <ul className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-8 [scrollbar-width:none] sm:-mx-8 sm:px-8">
                {visibleProjects.map((project) => (
                  <li key={project.slug} className="w-36 shrink-0 snap-start sm:w-44">
                    <Link href={projectHref(project)} onClick={closeMenu} className="block">
                      <span className="relative block aspect-[4/5] overflow-hidden">
                        <Image src={photos[project.slot]} alt="" fill sizes="11rem" className="object-cover" />
                      </span>
                      <span className="mt-2 block font-serif text-base font-light lowercase leading-tight text-beige">
                        {project.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            >
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-beige"
              >
                <WhatsAppIcon />
                WhatsApp us
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <div className="mt-8 flex flex-col gap-3 text-sm text-beige/70 sm:flex-row sm:items-center sm:justify-between">
                <a href={contact.phoneHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                  <PhoneIcon className="size-4 text-gold" />
                  {contact.phoneDisplay}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 break-all transition-colors hover:text-gold"
                >
                  <MailIcon className="size-4 shrink-0 text-gold" />
                  {contact.email}
                </a>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-gold"
                >
                  <InstagramIcon className="size-4 text-gold" />
                  {contact.instagramHandle}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
