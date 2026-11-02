import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { SplitText } from "@/components/SplitText";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { articles, journal } from "@/lib/journal";
import { site } from "@/lib/site";

const title = `Journal | ${site.name}`;
const description = `${journal.intro} From ${site.founder}, interior designer in ${site.location}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/journal" },
  openGraph: { type: "website", title, description, url: "/journal" },
};

export default function JournalPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section id="top" aria-labelledby="journal-title" className="bg-ink pt-28 md:pt-36">
          <div className="mx-auto max-w-360 px-5 pb-24 sm:px-8 md:pb-36 lg:px-12">
            <Reveal y={12}>
              <nav aria-label="Breadcrumb" className="text-[0.65rem] uppercase tracking-[0.3em] text-beige/60">
                <ol className="flex flex-wrap items-center gap-3">
                  <li>
                    <Link href="/" className="transition-colors duration-500 hover:text-gold">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-gold">
                    /
                  </li>
                  <li aria-current="page" className="text-gold">
                    Journal
                  </li>
                </ol>
              </nav>
            </Reveal>

            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <p className="eyebrow text-gold">{journal.eyebrow}</p>
                <SplitText
                  as="h1"
                  id="journal-title"
                  text={journal.heading}
                  className="display mt-6 text-[clamp(2.8rem,8vw,7rem)]"
                />
              </div>
              <Reveal delay={0.3} className="md:col-span-4">
                <p className="text-base font-light leading-relaxed text-beige/75 md:text-[1.05rem]">{journal.intro}</p>
              </Reveal>
            </div>

            <Stagger as="ul" stagger={0.12} className="mt-16 grid gap-14 md:mt-24 md:grid-cols-2 md:gap-x-8 md:gap-y-20 lg:grid-cols-3">
              {articles.map((article) => (
                <StaggerItem key={article.slug}>
                  <ArticleCard article={article} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
