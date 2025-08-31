import { ProjectIcon } from "@/components/icons";
import SectionHeading from "./SectionHeading";

const TestimonialsSection = () => {
  return (
    <div className="rounded-xl bg-white-35 p-24">
      <SectionHeading
        title="My Creative Tools"
        subTitle="Explore my portfolio and see how I bring ideas to life"
        badgeText="Testimonials"
        badgeIcon={<ProjectIcon />}
      />
    </div>
  );
};

export default TestimonialsSection;
