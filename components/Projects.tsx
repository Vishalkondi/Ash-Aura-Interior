import { ProjectGrid } from "./ProjectGrid";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { visibleProjects } from "@/lib/site";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">Selected work</p>
            <SplitText
              id="projects-title"
              className="display mt-8 text-[clamp(2.6rem,7vw,6rem)]"
              text="selected projects"
            />
          </div>
          <p className="max-w-sm text-base font-light leading-relaxed text-beige/70">
            Homes, kitchens, workplaces and cafés across PCMC and Pune, each designed around the people who use it.
          </p>
        </Reveal>

        <ProjectGrid projects={visibleProjects} />
      </div>
    </section>
  );
}
