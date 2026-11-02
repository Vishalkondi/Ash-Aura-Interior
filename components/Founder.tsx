import { ContactLinks } from "./ContactLinks";
import { CountUp } from "./CountUp";
import { ImageReveal } from "./ImageReveal";
import { OffsetFrame } from "./OffsetFrame";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { founderSection } from "@/lib/site";

export function Founder() {
  return (
    <section id="studio" aria-labelledby="founder-title" className="on-light bg-beige text-ink">
      <div className="mx-auto grid max-w-360 gap-16 px-5 py-24 sm:px-8 md:grid-cols-12 md:gap-8 md:py-36 lg:px-12 lg:py-44">
        <Reveal y={48} duration={1.4} className="md:col-span-5">
          <div className="relative mr-4 sm:mr-6">
            {/* offset gold frame behind the portrait */}
            <OffsetFrame className="translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <ImageReveal>
                <Photo slot="founder" sizes="(min-width: 768px) 40vw, 100vw" />
              </ImageReveal>
            </div>
            <div className="absolute -bottom-6 -left-2 bg-ink px-5 py-4 text-beige sm:-left-6 sm:px-7 sm:py-5">
              <p className="font-serif text-[clamp(3rem,7vw,4.5rem)] font-light leading-none text-gold">
                <CountUp value={founderSection.years} />
              </p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.28em] text-beige/80">
                {founderSection.yearsLabel}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-6 md:col-start-7 md:self-center">
          <Reveal>
            <p className="eyebrow text-gold-deep">{founderSection.eyebrow}</p>
            <SplitText
              id="founder-title"
              className="display mt-8 text-[clamp(2.6rem,6.5vw,5.5rem)]"
              text={founderSection.name}
            />
            <p className="mt-4 font-serif text-xl italic text-ink/70">{founderSection.role}</p>
            <div className="mt-8 space-y-4 text-base font-light leading-relaxed text-ink/80 md:text-[1.05rem]">
              {founderSection.bio.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <p className="mb-4 text-[0.65rem] uppercase tracking-[0.3em] text-ink/60">{founderSection.note}</p>
            <ContactLinks tone="light" items={["phone", "email", "instagram"]} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
