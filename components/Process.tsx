import { DrawLine } from "./DrawLine";
import { Reveal } from "./Reveal";
import { ScrollLine } from "./ScrollLine";
import { SplitText } from "./SplitText";
import { processSection } from "@/lib/site";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="bg-maroon">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
        <Reveal className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="eyebrow text-gold">{processSection.eyebrow}</p>
            <SplitText
              id="process-title"
              className="display mt-8 text-[clamp(2.6rem,7vw,6rem)]"
              text={processSection.heading}
            />
          </div>
          <p className="max-w-sm text-base font-light leading-relaxed text-beige/75 md:col-span-4 md:self-end">
            {processSection.intro}
          </p>
        </Reveal>

        <div className="relative mt-16 md:mt-24">
          <ScrollLine className="max-lg:hidden" />
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
            {processSection.steps.map((step, i) => (
              <li key={step.title} className="relative py-10 lg:pr-4">
                <DrawLine dot className="text-gold/40" delay={0.12 * i} />
                <Reveal delay={0.12 * i}>
                  <span className="font-serif text-[3.5rem] font-light leading-none text-gold/90">0{i + 1}</span>
                  <h3 className="mt-6 font-serif text-[1.75rem] font-light lowercase leading-tight text-beige">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[0.95rem] font-light leading-relaxed text-beige/75">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
