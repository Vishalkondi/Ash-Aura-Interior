import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/BeforeAfter";
import { DrawLine } from "@/components/DrawLine";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { ImageReveal } from "@/components/ImageReveal";
import { Magnetic } from "@/components/Magnetic";
import { Nav } from "@/components/Nav";
import { Parallax } from "@/components/Parallax";
import { ProjectGallery } from "@/components/ProjectGallery";
import { Reveal } from "@/components/Reveal";
import { SplitText } from "@/components/SplitText";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { Tilt } from "@/components/Tilt";
import { contact, getProject, photoDetails, photos, projectHref, site, visibleProjects } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const title = `${project.name} | ${site.name}`;
  const description = `${project.summary} ${project.type.split(" · ")[0]} by ${site.name}, interior designer in ${site.location}.`;
  const image = photos[project.slot];
  return {
    title,
    description,
    alternates: { canonical: projectHref(project) },
    openGraph: {
      type: "article",
      title,
      description,
      url: projectHref(project),
      images: [{ url: image, alt: photoDetails[project.slot].alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const index = visibleProjects.indexOf(project);
  const next = visibleProjects[(index + 1) % visibleProjects.length];
  const hero = { src: photos[project.slot], alt: photoDetails[project.slot].alt };
  const gallery = [hero, ...(project.gallery ?? [])].map((img) => ({
    ...img,
    title: project.name,
    subtitle: project.type,
  }));
  const details = [
    { label: "Type", value: project.type },
    { label: "Location", value: project.location },
    project.area && { label: "Area", value: project.area },
    project.year && { label: "Year", value: project.year },
    project.scope && { label: "Scope", value: project.scope },
  ].filter((d): d is { label: string; value: string } => Boolean(d));
  const whatsapp = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    `Hello Aishwarya, I saw the ${project.name} project on your website and would like something similar for my home.`,
  )}`;

  return (
    <>
      <Nav />
      <main id="main">
        <section id="top" aria-labelledby="project-title" className="bg-ink pt-28 md:pt-36">
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
                    <Link href="/#projects" className="transition-colors duration-500 hover:text-gold">
                      Projects
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-gold">
                    /
                  </li>
                  <li aria-current="page" className="text-gold">
                    {project.name}
                  </li>
                </ol>
              </nav>
            </Reveal>

            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <p className="eyebrow text-gold">{project.type}</p>
                <SplitText
                  as="h1"
                  id="project-title"
                  text={project.name}
                  className="display mt-6 text-[clamp(2.8rem,8vw,7rem)]"
                />
              </div>
              <Reveal delay={0.3} className="md:col-span-4">
                <p className="text-base font-light leading-relaxed text-beige/75 md:text-[1.05rem]">
                  {project.summary}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-360 px-5 sm:px-8 md:mt-16 lg:px-12">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10]">
              <ImageReveal delay={0.2}>
                <Parallax className="absolute inset-0" distance={6}>
                  <Image src={hero.src} alt={hero.alt} fill preload sizes="100vw" className="object-cover" />
                </Parallax>
              </ImageReveal>
            </div>
          </div>
        </section>

        <section aria-label="Project details" className="bg-ink">
          <div className="mx-auto grid max-w-360 gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:gap-8 md:py-28 lg:px-12">
            <Stagger as="dl" stagger={0.12} className="relative border-b border-gold/25 md:col-span-4">
              {details.map((d, i) => (
                <StaggerItem
                  as="div"
                  key={d.label}
                  className="relative flex items-baseline justify-between gap-6 py-5"
                >
                  <DrawLine className="text-gold/25" delay={0.12 * i} />
                  <dt className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">{d.label}</dt>
                  <dd className="text-right font-serif text-xl font-light text-beige">{d.value}</dd>
                </StaggerItem>
              ))}
            </Stagger>

            {project.story.length > 0 && (
              <Reveal delay={0.15} className="md:col-span-7 md:col-start-6">
                <h2 className="eyebrow text-gold">The design</h2>
                <div className="mt-8 space-y-6 font-serif text-[clamp(1.35rem,2.4vw,1.8rem)] font-light leading-snug text-beige/90">
                  {project.story.map((para, i) => (
                    <Reveal key={para} delay={0.2 + 0.15 * i} y={20}>
                      <p>{para}</p>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <section aria-labelledby="gallery-title" className="bg-ink pb-24 md:pb-36">
          <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
            <h2 id="gallery-title" className="sr-only">
              Gallery
            </h2>
            <ProjectGallery items={gallery} />
          </div>
        </section>

        {project.beforeAfter && (
          <section aria-labelledby="before-after-title" className="on-light bg-beige text-ink">
            <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-32 lg:px-12">
              <Reveal>
                <p className="eyebrow text-gold-deep">Transformation</p>
                <SplitText
                  id="before-after-title"
                  text="before and after"
                  className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)]"
                />
              </Reveal>
              <div className="mt-12">
                <BeforeAfter {...project.beforeAfter} />
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="project-cta-title" className="bg-bottle">
          <div className="mx-auto flex max-w-360 flex-col items-start gap-10 px-5 py-24 sm:px-8 md:flex-row md:items-end md:justify-between md:py-32 lg:px-12">
            <div>
              <p className="eyebrow text-gold">Start a project</p>
              <SplitText
                id="project-cta-title"
                text="want a space like this?"
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
                  Enquire about this
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center border border-gold/70 px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-beige transition-colors duration-500 hover:border-beige hover:bg-beige hover:text-ink"
                >
                  Send an enquiry
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </section>

        {next !== project && (
          <section aria-label="Next project" className="bg-ink">
            <Link
              href={projectHref(next)}
              className="group mx-auto grid max-w-360 items-center gap-8 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28 lg:px-12"
            >
              <div className="md:col-span-7">
                <p className="eyebrow text-gold">Next project</p>
                <p className="display mt-6 text-[clamp(2.4rem,6vw,5rem)] transition-colors duration-700 group-hover:text-gold">
                  {next.name}
                  <span
                    aria-hidden="true"
                    className="ml-4 inline-block transition-transform duration-700 ease-calm group-hover:translate-x-2"
                  >
                    →
                  </span>
                </p>
                <p className="mt-4 text-[0.65rem] uppercase tracking-[0.24em] text-gold">{next.type}</p>
              </div>
              <Tilt className="relative aspect-[16/10] overflow-hidden md:col-span-5">
                <ImageReveal>
                  <Image
                    src={photos[next.slot]}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover transition-transform duration-[2400ms] ease-calm group-hover:scale-[1.06]"
                  />
                </ImageReveal>
              </Tilt>
            </Link>
          </section>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
