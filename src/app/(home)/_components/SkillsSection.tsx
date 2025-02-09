import React from "react";
import SectionHeading from "./SectionHeading";
import { ExperienceIcon } from "@/components/icons";

const SkillsSection = () => {
  return (
    <div className="bg-white-35 p-24">
      <SectionHeading
        title="My Skills that Shine,  Expertise You Can Trust"
        subTitle="Explore my expertise and see how I can leverage my skills to drive your projects forward."
        badgeText="Experiences"
        badgeIcon={<ExperienceIcon />}
      />
    </div>
  );
};

export default SkillsSection;
