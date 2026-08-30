import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { getAllConfig } from "@/lib/config";
import { buildPerson, buildWebSite, graph } from "@/lib/schema";

const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection").then((m) => ({ default: m.SkillsSection })), { ssr: true });
const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then((m) => ({ default: m.AboutSection })), { ssr: true });
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((m) => ({ default: m.ContactSection })), { ssr: true });

export default async function Home() {
  const config = await getAllConfig();

  const jsonLd = graph([buildPerson(config), buildWebSite(config)]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <div className="animate-heroFadeIn">
          <HeroSection />
        </div>
        <div className="animate-fadeIn">
          <ProjectsSection />
          <SkillsSection />
          <AboutSection />
          <ContactSection />
        </div>
      </div>
    </>
  );
}