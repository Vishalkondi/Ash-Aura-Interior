"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

const groups = { div: motion.div, ul: motion.ul, ol: motion.ol, dl: motion.dl };
const items = { div: motion.div, li: motion.li };

type StaggerProps = {
  children: React.ReactNode;
  as?: keyof typeof groups;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Its StaggerItem children slide in one after another when the group scrolls into view. */
export function Stagger({ children, as = "div", className, delay = 0, stagger = 0.08 }: StaggerProps) {
  const Tag = groups[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {children}
    </Tag>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  as?: keyof typeof items;
  className?: string;
};

export function StaggerItem({ children, as = "li", className }: StaggerItemProps) {
  const Tag = items[as];
  return (
    <Tag
      className={className}
      variants={{ hidden: { opacity: 0, x: -14 }, shown: { opacity: 1, x: 0 } }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
