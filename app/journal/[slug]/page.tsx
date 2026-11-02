import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { ImageReveal } from "@/components/ImageReveal";
import { Magnetic } from "@/components/Magnetic";
import { Nav } from "@/components/Nav";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { SplitText } from "@/components/SplitText";
import { articleHref, articles, formatDate, getArticle } from "@/lib/journal";
import { contact, site, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const title = `${article.title} | ${site.name}`;
  return {
    title,
    description: article.excerpt,
    alternates: { canonical: articleHref(article) },
    openGraph: {
      type: "article",
      title,
      description: article.excerpt,
      url: articleHref(article),
      publishedTime: article.date,
      authors: [site.founder],
      images: [{ url: article.image.src, alt: article.image.alt }],
    },
    twitter: { card: "summary_large_image", title, description: article.excerpt, images: [article.image.src] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const more = articles.filter((a) => a !== article).slice(0, 2);
  const whatsapp = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    `Hello Aishwarya, I read "${article.title}" on your website and would like to talk about my space.`,
  )}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    image: `${siteUrl}${article.image.src}`,
    url: `${siteUrl}${articleHref(article)}`,
    author: { "@type": "Person", name: site.founder },
    publisher: { "@id": `${siteUrl}/#business` },
  };

  return (
    <>
      <Nav />
      <main id="main">
        <article aria-labelledby="article-title">
          <header id="top" className="bg-ink pt-28 md:pt-36">
            <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
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
                    <li>
                      <Link href="/journal" className="transition-colors duration-500 hover:text-gold">
                        Journal
                      </Link>
                    </li>
                    <li aria-hidden="true" className="text-gold">
                      /
                    </li>
                    <li aria-current="page" className="text-gold">
                      {article.category}
                    </li>
                  </ol>
                </nav>
              </Reveal>

              <div className="mt-10 max-w-5xl md:mt-14">
                <p className="eyebrow text-gold">
                  <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readMinutes} min read
                </p>
                <SplitText
                  as="h1"
                  id="article-title"
                  text={article.title}
                  className="display mt-6 text-[clamp(2.6rem,7vw,6rem)]"
                />
                <Reveal delay={0.3}>
                  <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-beige/75 md:text-[1.1rem]">
                    {article.excerpt}
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-360 px-5 sm:px-8 md:mt-16 lg:px-12">
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]">
                <ImageReveal delay={0.2}>
                  <Parallax className="absolute inset-0" distance={6}>
                    <Image
                      src={article.image.src}
                      alt={article.image.alt}
                      fill
                      preload
                      sizes="100vw"
                      className="object-cover"
                    />
                  </Parallax>
                </ImageReveal>
              </div>
            </div>
          </header>

          <div className="bg-ink">
            <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 md:py-28 lg:px-12">
              <div className="mx-auto max-w-2xl space-y-12">
                {article.sections.map((section, i) => (
                  <Reveal key={section.heading ?? i} y={20}>
                    {section.heading && (
                      <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] font-light lowercase leading-tight text-gold">
                        {section.heading}
                      </h2>
                    )}
                    <div className={`space-y-5 ${section.heading ? "mt-5" : ""}`}>
                      {section.paragraphs.map((para) => (
                        <p
                          key={para}
                          className={
                            i === 0 && !section.heading
                              ? "font-serif text-[clamp(1.35rem,2.4vw,1.75rem)] font-light leading-snug text-beige/90"
                              : "text-[1.05rem] font-light leading-[1.8] text-beige/80"
                          }
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                ))}

                <p className="border-t border-gold/25 pt-8 text-[0.65rem] uppercase tracking-[0.28em] text-gold">
                  {site.founder} · {site.name}
                </p>
              </div>
            </div>
          </div>
        </article>

        <section aria-labelledby="article-cta-title" className="bg-bottle">
          <div className="mx-auto flex max-w-360 flex-col items-start gap-10 px-5 py-24 sm:px-8 md:flex-row md:items-end md:justify-between md:py-32 lg:px-12">
            <div>
              <p className="eyebrow text-gold">Start a project</p>
              <SplitText
                id="article-cta-title"
                text="planning your own space?"
                className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)]"
              />
            </div>
            <Reveal delay={0.3} className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Magnetic>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-beige"
                >
                  <WhatsAppIcon />
                  Talk to Aishwarya
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/#estimate"
                  className="inline-flex items-center justify-center border border-gold/70 px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-beige transition-colors duration-500 hover:border-beige hover:bg-beige hover:text-ink"
                >
                  Estimate your budget
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </section>

        {more.length > 0 && (
          <section aria-labelledby="more-title" className="bg-ink">
            <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 md:py-28 lg:px-12">
              <h2 id="more-title" className="eyebrow text-gold">
                More from the journal
              </h2>
              <ul className="mt-12 grid gap-14 md:grid-cols-2 md:gap-8">
                {more.map((a) => (
                  <li key={a.slug}>
                    <ArticleCard article={a} sizes="(min-width: 768px) 45vw, 100vw" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
