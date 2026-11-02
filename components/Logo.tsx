/** Vector "A" mark with the wave crossbar, drawn after the studio logo. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      <path d="M46 6h9l25.5 80h-12.8z" />
      <path d="M47.2 9.5l2.6 4.2L29.4 86h-2.6z" />
      <path d="M18 85.6h19v2.6H18zM60.5 85.6h28v2.6h-28z" />
      <path d="M31 63.5c8-11 20.5-14 30-8.5 6.6 3.8 13.6 3.4 21.6-6.6-3.6 12.6-13.4 18.2-24 13.4-9.6-4.4-18.8-5.4-27.6 1.7z" />
      <path
        d="M27.5 60.5c6.5-12.2 19.6-17 29.5-12.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M29.5 66c7.6-6.4 17.4-6.6 25.6-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
