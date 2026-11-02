import { HeroGallery } from "./HeroGallery";
import { HeroVideo } from "./HeroVideo";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { services, site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden bg-ink pb-20 pt-20 md:pb-32 md:pt-24">
      {/* Soft gold light behind the logo; breathes slowly unless motion is reduced. */}
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute left-1/2 top-0 -z-10 aspect-square w-[min(70rem,140vw)] -translate-x-1/2 -translate-y-[38%]" />

      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <h1 className="sr-only">Ash Aura Interiors, interior design studio in PCMC, Pune</h1>
        {/* The logo animation; its black margins are pulled in so the tagline sits close beneath. */}
        <Reveal y={0} duration={1.2} className="-mb-[clamp(1rem,7vw,5.5rem)] -mt-[clamp(0.5rem,3vw,2.5rem)]">
          <HeroVideo />
        </Reveal>

        <div className="relative text-center">
          <SplitText
            as="p"
            text={site.tagline}
            delay={0.8}
            stagger={0.06}
            className="mx-auto max-w-xl text-balance font-serif text-[clamp(1.5rem,4vw,2.4rem)] font-light italic leading-snug text-beige/85"
          />
          <Reveal delay={1.2} y={10}>
            <p className="eyebrow mt-5 justify-center text-balance text-gold before:hidden sm:before:block">
              Interior design studio · {site.location}
            </p>
          </Reveal>
          <Reveal
            delay={1.4}
            y={14}
            className="mx-auto mt-10 flex max-w-xs flex-col justify-center gap-3 *:w-full sm:max-w-none sm:flex-row sm:gap-4 sm:*:w-auto"
          >
            <Magnetic>
              <a
                href="#book"
                className="group relative inline-flex w-full min-w-60 items-center justify-center gap-3 overflow-hidden bg-gold px-8 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-ink"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-y-full bg-beige transition-transform duration-500 ease-calm group-hover:translate-y-0"
                />
                <span className="relative">Book a consultation</span>
                <span aria-hidden="true" className="relative transition-transform duration-500 ease-calm group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#projects"
                className="inline-flex w-full min-w-60 items-center justify-center gap-3 border border-gold/50 px-8 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-beige transition-colors duration-500 hover:border-gold hover:text-gold"
              >
                View projects
              </a>
            </Magnetic>
          </Reveal>
        </div>

        {/* Studio facts in the lower corners of the opening screen, on large screens. */}
        <Reveal delay={1.6} y={10} className="pointer-events-none max-lg:hidden">
          <div className="relative">
            <p className="absolute -top-28 left-0 max-w-44 text-[0.62rem] uppercase leading-relaxed tracking-[0.26em] text-beige/50">
              <span className="block font-serif text-4xl normal-case tracking-normal text-gold">{site.experience}</span>
              years designing homes and workplaces
            </p>
            <ul className="absolute -top-28 right-0 space-y-1.5 text-right text-[0.62rem] uppercase tracking-[0.26em] text-beige/50">
              {services.items.map((item) => (
                <li key={item.title}>{item.title}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <HeroGallery />
      </div>
    </section>
  );
}
