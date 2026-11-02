import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { statement } from "@/lib/site";

export function Statement() {
  return (
    <section aria-labelledby="statement-title" className="on-light bg-beige text-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-8">
            <p className="eyebrow text-gold-deep">{statement.eyebrow}</p>
            <SplitText
              id="statement-title"
              className="display mt-8 text-[clamp(2.6rem,7vw,6rem)]"
              text={statement.heading}
            />
          </Reveal>
          <Reveal delay={0.2} className="md:col-span-4 md:self-end">
            <p className="text-base font-light leading-relaxed text-ink/80 md:text-[1.05rem]">{statement.body}</p>
          </Reveal>
        </div>

        <dl className="mt-20 grid border-t border-gold md:mt-28 md:grid-cols-3">
          {statement.facts.map((fact, i) => (
            <Reveal
              key={fact.value}
              delay={0.12 * i}
              className="border-b border-gold/50 py-8 md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0"
            >
              <dt className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
                <CountUp value={fact.value} />
              </dt>
              <dd className="mt-3 text-[0.72rem] uppercase tracking-[0.24em] text-gold-deep">{fact.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
