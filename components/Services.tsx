import { DrawLine } from "./DrawLine";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { Stagger, StaggerItem } from "./Stagger";
import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="on-light bg-beige text-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
        <Reveal>
          <p className="eyebrow text-gold-deep">{services.eyebrow}</p>
          <SplitText
            id="services-title"
            className="display mt-8 text-[clamp(2.6rem,7vw,6rem)]"
            text={services.heading}
          />
        </Reveal>

        <ol className="mt-16 grid gap-x-8 sm:grid-cols-2 md:mt-24 lg:grid-cols-4 lg:gap-x-10">
          {services.items.map((item, i) => (
            <li key={item.title} className="group relative py-10 lg:pb-0">
              <DrawLine className="text-gold" delay={0.12 * i} />
              <Reveal delay={0.12 * i}>
                <span className="inline-block font-serif text-lg italic text-gold-deep transition-transform duration-700 ease-calm group-hover:-translate-y-1">
                  0{i + 1}
                </span>
                <h3 className="mt-6 font-serif text-[2rem] font-light lowercase leading-tight transition-transform duration-700 ease-calm group-hover:translate-x-2">
                  {item.title}
                </h3>
                <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-ink/75">{item.body}</p>
                <Stagger as="ul" delay={0.35 + 0.12 * i} className="mt-7 space-y-2">
                  {item.points.map((point) => (
                    <StaggerItem
                      key={point}
                      className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-ink/70"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1 rounded-full bg-accent transition-transform duration-500 ease-calm group-hover:scale-150"
                      />
                      {point}
                    </StaggerItem>
                  ))}
                </Stagger>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
