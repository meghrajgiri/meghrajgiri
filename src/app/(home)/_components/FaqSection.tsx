import { ProjectIcon } from "@/components/icons";
import SectionHeading from "./SectionHeading";

const FaqSection = () => {
  return (
    <div className="bg-white-35 p-24">
      <SectionHeading
        title="My Creative Tools"
        subTitle="Explore my portfolio and see how I bring ideas to life"
        badgeText="Faqs"
        badgeIcon={<ProjectIcon />}
      />
    </div>
  );
};

export default FaqSection;
