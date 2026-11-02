import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { Reveal } from "./Reveal";
import { ScrollLine } from "./ScrollLine";
import { SplitText } from "./SplitText";
import { Stagger, StaggerItem } from "./Stagger";
import { articles, journal } from "@/lib/journal";

/** The three newest journal articles, on the home page. */
export function JournalTeaser() {
  if (articles.length === 0) return null;

  return (
    <section id="journal" aria-labelledby="journal-title" className="relative bg-ink">
      <ScrollLine />
      <div className="mx-auto max-w-360 px-5 pb-24 pt-16 sm:px-8 md:pb-36 md:pt-24 lg:px-12 lg:pb-44">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">{journal.eyebrow}</p>
            <SplitText id="journal-title" className="display mt-8 text-[clamp(2.6rem,7vw,6rem)]" text={journal.heading} />
            <p className="mt-6 max-w-md text-base font-light leading-relaxed text-beige/70">{journal.intro}</p>
          </div>
          <Link
            href="/journal"
            className="group inline-flex items-center gap-3 self-start text-[0.7rem] uppercase tracking-[0.26em] text-gold transition-colors duration-500 hover:text-beige md:self-auto"
          >
            All articles
            <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>

        <Stagger as="ul" stagger={0.12} className="mt-14 grid gap-14 md:mt-20 md:grid-cols-3 md:gap-8">
          {articles.slice(0, 3).map((article) => (
            <StaggerItem key={article.slug}>
              <ArticleCard article={article} sizes="(min-width: 768px) 30vw, 100vw" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
