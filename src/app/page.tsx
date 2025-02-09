import FaqSection from "./(home)/_components/FaqSection";
import HeroSection from "./(home)/_components/HeroSection";
import ProjectSection from "./(home)/_components/ProjectSection";
import SkillsSection from "./(home)/_components/SkillsSection";
import TestimonialsSection from "./(home)/_components/TestimonialsSection";
import ToolsSection from "./(home)/_components/ToolsSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="mx-auto max-w-[1120px]">
        <SkillsSection />
        <ProjectSection />
        <ToolsSection />
        <TestimonialsSection />
        <FaqSection />
      </div>
    </div>
  );
}
