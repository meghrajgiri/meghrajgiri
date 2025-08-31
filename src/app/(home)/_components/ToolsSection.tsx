import { ProjectIcon } from "@/components/icons";
import MySkillSection from "../MySkillSection";
import SectionHeading from "./SectionHeading";

const ToolsSection = () => {
  return (
    <div className="rounded-xl bg-white-35 p-24">
      <SectionHeading
        title="My Skills that Shine,  Expertise You Can Trust"
        subTitle="Explore my portfolio and see how I bring ideas to life"
        badgeText="Tools"
        badgeIcon={<ProjectIcon />}
      />
      <MySkillSection />
    </div>
  );
};

export default ToolsSection;
