"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };

type SplitTextProps = {
  text: string;
  as?: keyof typeof tags;
  id?: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Each word rises out of a mask, one after another, when the line scrolls into view. */
export function SplitText({ text, as = "h2", id, className, delay = 0, stagger = 0.07 }: SplitTextProps) {
  const Tag = tags[as];
  const words = text.split(" ");

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
