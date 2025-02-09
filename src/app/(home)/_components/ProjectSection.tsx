import { ProjectIcon } from "@/components/icons";
import SectionHeading from "./SectionHeading";

const ProjectSection = () => {
  return (
    <div className="bg-white-35 p-24">
      <SectionHeading
        title="My Creative Project"
        subTitle="Explore my portfolio and see how I bring ideas to life"
        badgeText="Projects"
        badgeIcon={<ProjectIcon />}
      />
    </div>
  );
};

export default ProjectSection;
