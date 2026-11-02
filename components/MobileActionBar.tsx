"use client";

import { useEffect, useState } from "react";
import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { contact } from "@/lib/site";

const TYPING = "input:not([type=radio]):not([type=checkbox]):not([type=hidden]), textarea, select";

/**
 * Call and WhatsApp buttons fixed to the bottom of the screen on phones and
 * small tablets. Slides away while the on-screen keyboard is open so it never
 * covers a form field. Hidden from md up, where the floating button is used.
 */
export function MobileActionBar() {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => setTyping((e.target as Element).matches?.(TYPING) ?? false);
    const onFocusOut = () => setTyping(false);
    // Backup for keyboards that stay open without a focus change.
    const viewport = window.visualViewport;
    const onResize = () => viewport && setTyping(window.innerHeight - viewport.height > 150);

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    viewport?.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      viewport?.removeEventListener("resize", onResize);
    };
  }, []);

  const button =
    "flex flex-1 items-center justify-center gap-2.5 py-4 text-[0.7rem] uppercase tracking-[0.24em] transition-colors duration-500";

  return (
    <>
      {/* Keeps the end of the page clear of the bar. */}
      <div aria-hidden="true" className="h-[calc(3.5rem+env(safe-area-inset-bottom))] bg-ink md:hidden" />
      <nav
        aria-label="Quick contact"
        aria-hidden={typing || undefined}
        className={`fixed inset-x-0 bottom-0 z-30 flex border-t border-gold/25 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-500 ease-calm md:hidden ${
          typing ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <a href={contact.phoneHref} tabIndex={typing ? -1 : undefined} className={`${button} text-beige hover:text-gold`}>
          <PhoneIcon />
          Call
        </a>
        <a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={typing ? -1 : undefined}
          className={`${button} bg-gold text-ink hover:bg-beige`}
        >
          <WhatsAppIcon />
          WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </nav>
    </>
  );
}
