import React from "react";
import { Paragraph } from "../typography";

interface BadgeProps {
  text: string;
  icon: React.ReactNode;
}

export const Badge = (props: BadgeProps) => {
  const { text, icon } = props;
  return (
    <div className="w-fit rounded-full border border-white-100 bg-white-35 p-1">
      <div className="flex items-center space-x-2 rounded-full bg-white-100 p-2.5">
        {icon}
        <Paragraph
          text={text}
          weight="regular"
          className="text-secondary"
          variant="small"
        />
      </div>
    </div>
  );
};
