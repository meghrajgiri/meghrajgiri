import { ProjectIcon } from "@/components/icons";
import SectionHeading from "./SectionHeading";

const ToolsSection = () => {
  return (
    <div className="bg-white-35 p-24">
      <SectionHeading
        title="My Creative Tools"
        subTitle="Explore my portfolio and see how I bring ideas to life"
        badgeText="Tools"
        badgeIcon={<ProjectIcon />}
      />
    </div>
  );
};

export default ToolsSection;
