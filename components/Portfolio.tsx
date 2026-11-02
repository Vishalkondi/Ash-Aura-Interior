import fs from "node:fs";
import path from "node:path";
import { PortfolioForm } from "./PortfolioForm";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { portfolio } from "@/lib/site";

/** "Get our portfolio" lead capture. Renders only once the PDF is in /public. */
export function Portfolio() {
  if (!fs.existsSync(path.join(process.cwd(), "public", portfolio.file))) return null;

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="bg-maroon">
      <div className="mx-auto grid max-w-360 gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-gold">{portfolio.eyebrow}</p>
          <SplitText
            id="portfolio-title"
            className="display mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)]"
            text={portfolio.heading}
          />
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-beige/75">{portfolio.body}</p>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7 lg:self-end">
          <PortfolioForm />
        </Reveal>
      </div>
    </section>
  );
}
