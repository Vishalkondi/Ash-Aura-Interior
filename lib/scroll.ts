import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Freeze page scrolling while an overlay (menu, lightbox) is open. */
export function lockScroll() {
  lenis?.stop();
  document.documentElement.classList.add("lenis-stopped");
}

export function unlockScroll() {
  lenis?.start();
  document.documentElement.classList.remove("lenis-stopped");
}
