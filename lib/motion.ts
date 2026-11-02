"use client";

import { useSyncExternalStore } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

const query = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/**
 * True when the visitor prefers reduced motion. Always false on the server and
 * during hydration, so server and client markup match.
 */
export function useReducedMotionSafe() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
