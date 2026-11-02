"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; r: number; speed: number; sway: number; phase: number; alpha: number; blur: boolean };

const COUNT = 46;

function spawn(width: number, height: number, anywhere: boolean): Particle {
  // A few large, soft bokeh discs among many small sharp specks, like the logo video.
  const blur = Math.random() < 0.12;
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 10,
    r: blur ? 4 + Math.random() * 6 : 0.6 + Math.random() * 1.8,
    speed: 4 + Math.random() * 10,
    sway: 4 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2,
    alpha: blur ? 0.08 + Math.random() * 0.12 : 0.35 + Math.random() * 0.5,
    blur,
  };
}

/**
 * Slow gold specks drifting upwards, drawn on a canvas. Used over the held
 * last frame of the hero logo video so the hero keeps a gentle motion. It
 * only runs while visible and in a visible tab.
 */
export function GoldParticles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let last = 0;
    let onScreen = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: COUNT }, () => spawn(width, height, true));
    };

    const draw = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed * dt;
        p.phase += dt * 0.6;
        if (p.y < -12) Object.assign(p, spawn(width, height, false));
        const x = p.x + Math.sin(p.phase) * p.sway;
        const twinkle = 0.75 + Math.sin(p.phase * 2.3) * 0.25;
        const glow = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r * (p.blur ? 1 : 2.4));
        glow.addColorStop(0, `rgba(240, 210, 150, ${p.alpha * twinkle})`);
        glow.addColorStop(p.blur ? 0.7 : 0.35, `rgba(184, 149, 106, ${p.alpha * twinkle * 0.6})`);
        glow.addColorStop(1, "rgba(184, 149, 106, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r * (p.blur ? 1 : 2.4), 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };

    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
