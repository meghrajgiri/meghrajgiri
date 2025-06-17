import { Badge, Button, Heading, Paragraph } from "@/components";
import { CheckIcon, HireIcon } from "@/components/icons";
import Marquee from "react-fast-marquee";
import AchivementCard from "./AchivementCard";

const highlights = [
  "Full Stack Development",
  "React",
  "Next.js",
  "React Native",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Firebase",
  "GraphQL",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "TypeScript",
];

const HeroSection = () => {
  return (
    <div className="flex h-screen min-h-screen flex-col items-center justify-center bg-background bg-hero-grid bg-cover bg-center bg-no-repeat">
      <div className="flex max-w-[840px] flex-col items-center space-y-8">
        <Badge text="Available for Hire" icon={<HireIcon />} />
        <Heading
          as="h1"
          weight="medium"
          text="Hey, I’m Meghraj. I'm a 
Full Stack Developer."
          className="text-center text-primary"
        />
        <Paragraph
          text="Meghraj is a versatile developer based in Nepal, dedicated to crafting innovative and visually appealing Web & Mobile applications."
          weight="medium"
          variant="para-18"
          className="text-center text-secondary"
        />
        <Button size="md" variant="primary" text="Lets Work Together" />
        <Marquee className="space-x-4">
          <div className="flex space-x-4 opacity-75">
            {highlights.map((highlight) => (
              <Badge key={highlight} text={highlight} icon={<CheckIcon />} />
            ))}
          </div>
        </Marquee>
      </div>
      <AchivementCard />
    </div>
  );
};

export default HeroSection;
