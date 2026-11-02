"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

/** Oversized studio name that rises out of a mask when the footer scrolls into view. */
export function FooterWordmark({ text }: { text: string }) {
  // The mask is observed, not the text: text pushed out of a clipped box never counts as in view.
  return (
    <motion.div
      aria-hidden="true"
      className="overflow-hidden"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.p
        variants={{ hidden: { y: "100%" }, shown: { y: "0%" } }}
        transition={{ duration: 1.6, ease: EASE }}
        className="select-none whitespace-nowrap bg-gradient-to-b from-gold via-gold to-gold/35 bg-clip-text pb-[0.06em] text-center font-serif text-[clamp(4rem,20vw,19rem)] font-light leading-[0.9] tracking-[-0.02em] text-transparent"
      >
        {text}
      </motion.p>
    </motion.div>
  );
}
