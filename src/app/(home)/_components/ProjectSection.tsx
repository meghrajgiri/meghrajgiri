import ProjectCard from "@/components/cards/ProjectCard";
import { ProjectIcon } from "@/components/icons";
import SectionHeading from "./SectionHeading";

const ProjectSection = () => {
  const projects = [
    {
      image: "/logo.png",
      title: "Haxus",
      tool: "Framer",
      price: 0,
      tag: "Free",
      link: "#",
    },
    {
      image: "/logo.png",
      title: "Betun Sass APP",
      tool: "Framer",
      price: 0,
      tag: "Free",
      link: "#",
    },
  ];
  return (
    <div className="rounded-xl bg-white-35 p-24">
      <SectionHeading
        title="My Creative Project"
        subTitle="Explore my portfolio and see how I bring ideas to life"
        badgeText="Projects"
        badgeIcon={<ProjectIcon />}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
};

export default ProjectSection;
