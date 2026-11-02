import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { faq } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-bottle">
      <div className="mx-auto grid max-w-360 gap-12 px-5 py-24 sm:px-8 md:grid-cols-12 md:gap-8 md:py-36 lg:px-12 lg:py-44">
        <Reveal className="md:col-span-4">
          <p className="eyebrow text-gold">{faq.eyebrow}</p>
          <SplitText id="faq-title" className="display mt-8 text-[clamp(2.6rem,6vw,5rem)]" text={faq.heading} />
        </Reveal>

        <Reveal delay={0.15} className="md:col-span-7 md:col-start-6">
          <div className="border-t border-gold/30">
            {faq.items.map((item) => (
              <details key={item.q} className="faq-item group border-b border-gold/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-[1.45rem] font-light leading-snug text-beige transition-colors duration-500 group-hover:text-gold sm:text-[1.7rem]">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 group-open:bg-gold group-open:text-bottle"
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current transition-transform duration-500 ease-calm group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="faq-answer max-w-2xl pb-7 pr-12 text-base font-light leading-relaxed text-beige/80">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
