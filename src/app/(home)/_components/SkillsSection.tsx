import SkillCard from "@/components/cards/SkillCard";
import { ExperienceIcon } from "@/components/icons";
import SectionHeading from "./SectionHeading";

const skills = [
  {
    icon: (
      // Globe icon for Web Design
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#223344" strokeWidth="2" />
        <path
          d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"
          stroke="#223344"
          strokeWidth="2"
        />
      </svg>
    ),
    title: "Web Design",
    description:
      "with more than 4 years of experience in this field, more than many people like our services",
  },
  {
    icon: (
      // Paint palette for Graphic Designer
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#223344" strokeWidth="2" />
        <circle cx="8" cy="10" r="1" fill="#223344" />
        <circle cx="16" cy="10" r="1" fill="#223344" />
        <circle cx="9" cy="15" r="1" fill="#223344" />
        <circle cx="15" cy="15" r="1" fill="#223344" />
      </svg>
    ),
    title: "Graphic Designer",
    description:
      "with more than 4 years of experience in this field, more than many people like our services",
  },
  {
    icon: (
      // Layout icon for UI Design
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          stroke="#223344"
          strokeWidth="2"
        />
        <rect
          x="7"
          y="7"
          width="10"
          height="4"
          rx="1"
          stroke="#223344"
          strokeWidth="2"
        />
        <rect
          x="7"
          y="13"
          width="4"
          height="4"
          rx="1"
          stroke="#223344"
          strokeWidth="2"
        />
        <rect
          x="13"
          y="13"
          width="4"
          height="4"
          rx="1"
          stroke="#223344"
          strokeWidth="2"
        />
      </svg>
    ),
    title: "UI Design",
    description:
      "with more than 4 years of experience in this field, more than many people like our services",
  },
  {
    icon: (
      // Pen nib for Logo Designer
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M12 19l7-7-7-7-7 7 7 7z" stroke="#223344" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="#223344" />
      </svg>
    ),
    title: "Logo Designer",
    description:
      "with more than 4 years of experience in this field, more than many people like our services",
  },
  {
    icon: (
      // Code brackets for Web Development
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path
          d="M8 17l-5-5 5-5M16 7l5 5-5 5"
          stroke="#223344"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="10"
          y="3"
          width="4"
          height="18"
          rx="2"
          fill="#223344"
          opacity="0.1"
        />
      </svg>
    ),
    title: "Web Development",
    description:
      "with more than 4 years of experience in this field, more than many people like our services",
  },
  {
    icon: (
      // Play icon for Motion Designer
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#223344" strokeWidth="2" />
        <polygon points="10,8 16,12 10,16" fill="#223344" />
      </svg>
    ),
    title: "Motion Designer",
    description:
      "with more than 4 years of experience in this field, more than many people like our services",
  },
  // Add more skills as needed
];

const SkillsSection = () => {
  return (
    <div className="rounded-xl bg-white-35 p-24">
      <SectionHeading
        title="My Skills that Shine,  Expertise You Can Trust"
        subTitle="Explore my expertise and see how I can leverage my skills to drive your projects forward."
        badgeText="Experiences"
        badgeIcon={<ExperienceIcon />}
      />
      <div className="grid grid-cols-3 gap-8 p-6 sm:grid-cols-2 md:grid-cols-3">
        {skills.map((skill, idx) => (
          <SkillCard
            key={idx}
            icon={skill.icon}
            title={skill.title}
            description={skill.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
