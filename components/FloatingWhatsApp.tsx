"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./Icons";
import { contact } from "@/lib/site";

/** Round WhatsApp button that appears after the hero and hides over the contact section and footer. */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sections it would cover, such as the contact links and "Back to top".
    const covered = new Set<Element>();

    const update = () => setVisible(window.scrollY > window.innerHeight * 0.8 && covered.size === 0);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) covered.add(entry.target);
        else covered.delete(entry.target);
      }
      update();
    });
    document.querySelectorAll("#contact, footer").forEach((el) => observer.observe(el));

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <a
      href={contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp (opens in a new tab)"
      tabIndex={visible ? undefined : -1}
      aria-hidden={!visible || undefined}
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex size-14 items-center justify-center rounded-full bg-gold text-ink shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-[opacity,transform,background-color] duration-700 ease-calm hover:bg-beige sm:right-8 max-md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
