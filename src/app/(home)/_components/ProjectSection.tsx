import ProjectCard from "@/components/cards/ProjectCard";
import { ProjectIcon } from "@/components/icons";
import { SITE_DATA } from "@/config";
import SectionHeading from "./SectionHeading";

const ProjectSection = () => {
  return (
    <div className="rounded-xl bg-white-35 p-24">
      <SectionHeading
        title={SITE_DATA.projects.title}
        subTitle={SITE_DATA.projects.subtitle}
        badgeText={SITE_DATA.projects.badge}
        badgeIcon={<ProjectIcon />}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SITE_DATA.projects.projects.map((project) => (
          <ProjectCard
            key={project.id}
            image={project.image}
            title={project.title}
            tool={project.technologies[0]}
            price={0}
            tag={project.status}
            link={project.links?.demo || "#"}
          />
        ))}
      </div>

      {/* Call to Action */}
      {SITE_DATA.projects.callToAction && (
        <div className="mt-16 space-y-6 text-center">
          <h3 className="text-2xl font-bold">
            {SITE_DATA.projects.callToAction.title}
          </h3>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            {SITE_DATA.projects.callToAction.description}
          </p>
          <button
            onClick={() => {
              const element = document.querySelector("#contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-primary-foreground hover:bg-primary/90 rounded-lg bg-primary px-8 py-3 font-medium transition-colors"
          >
            {SITE_DATA.projects.callToAction.buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSection;
