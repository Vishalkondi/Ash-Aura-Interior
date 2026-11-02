import Image from "next/image";
import { InstagramIcon } from "./Icons";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { Stagger, StaggerItem } from "./Stagger";
import { contact, instagram } from "@/lib/site";

/** Six-photo grid linking to the studio's Instagram. */
export function Instagram() {
  return (
    <section id="instagram" aria-labelledby="instagram-title" className="bg-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">{instagram.eyebrow}</p>
            <SplitText
              id="instagram-title"
              className="display mt-8 text-[clamp(2.6rem,7vw,6rem)]"
              text={instagram.heading}
            />
            <p className="mt-6 max-w-md text-base font-light leading-relaxed text-beige/70">{instagram.body}</p>
          </div>
          <span className="inline-flex">
            <Magnetic>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-gold/70 px-7 py-4 text-[0.72rem] uppercase tracking-[0.24em] text-beige transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink"
              >
                <InstagramIcon />
                Follow {contact.instagramHandle}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Magnetic>
          </span>
        </Reveal>

        <Stagger as="ul" stagger={0.08} className="mt-14 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:mt-20 lg:grid-cols-6">
          {instagram.posts.map((post) => (
            <StaggerItem key={post.src} className="relative">
              <a
                href={post.href ?? contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden focus-visible:outline-offset-[-4px]"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1600ms] ease-calm group-hover:scale-[1.08]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-ink/55 text-beige opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <InstagramIcon className="size-7" />
                </span>
                <span className="sr-only">(opens Instagram in a new tab)</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
