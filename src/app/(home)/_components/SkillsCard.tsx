import React from "react";

interface SkillsCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const SkillsCard: React.FC<SkillsCardProps> = (props) => {
  const { title, icon, description } = props;
  return (
    <div>
      <div>{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default SkillsCard;
