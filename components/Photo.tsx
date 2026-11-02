import Image from "next/image";
import { photoDetails, photos, type PhotoSlot } from "@/lib/site";

type PhotoProps = {
  slot: PhotoSlot;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

/**
 * Fills its (relatively positioned) parent. Renders the photo set in
 * `photos[slot]`, or a tone-coloured placeholder panel when the slot is empty.
 */
export function Photo({ slot, sizes, priority, className = "", imageClassName = "" }: PhotoProps) {
  const src = photos[slot];
  const { alt, label, tone } = photoDetails[slot];

  if (src) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          loading={priority ? "eager" : undefined}
          className={`object-cover ${imageClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} (photo coming soon)`}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className={`absolute inset-0 ${imageClassName}`}
        style={{
          backgroundColor: tone,
          backgroundImage: `radial-gradient(120% 90% at 30% 20%, rgba(232,220,200,0.10), transparent 60%), linear-gradient(180deg, transparent 40%, rgba(10,9,8,0.35))`,
        }}
      />
      <div className="absolute inset-3 border border-gold/20 sm:inset-4" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <span className="font-serif text-2xl font-light lowercase italic text-beige/70 sm:text-3xl">
          {label}
        </span>
        <span className="text-[0.62rem] uppercase tracking-[0.3em] text-gold/80">{slot}</span>
      </div>
    </div>
  );
}
