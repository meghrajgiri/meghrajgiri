import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getAllConfig } from "@/lib/config";

export default async function Home() {
  const config = await getAllConfig();
  const { personal, metadata, contact } = config;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal?.name,
    url: metadata?.url,
    jobTitle: personal?.role,
    email: personal?.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: personal?.location,
    },
    sameAs: contact?.socialLinks
      ?.filter((link) => link.url)
      .map((link) => link.url) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="animate-fadeIn">
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </div>
    </>
  );
}