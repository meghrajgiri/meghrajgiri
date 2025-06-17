import { Badge, Heading, Paragraph } from "@/components";
import React from "react";

interface SectionHeadingProps {
  badgeText: string;
  badgeIcon: React.ReactNode;
  title: string;
  subTitle: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = (props) => {
  const { badgeText, badgeIcon, title, subTitle } = props;
  return (
    <div className="flex flex-col items-center space-y-4">
      <Badge text={badgeText} icon={badgeIcon} />

      <Heading
        as="h2"
        weight="regular"
        text={title}
        className="text-center text-primary"
      />

      <Paragraph
        text={subTitle}
        weight="medium"
        variant="para-18"
        className="max-w-[840px] text-center text-secondary"
      />
    </div>
  );
};

export default SectionHeading;
