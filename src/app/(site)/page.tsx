import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { getAllConfig } from "@/lib/config";

const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection").then((m) => ({ default: m.SkillsSection })), { ssr: true });
const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then((m) => ({ default: m.AboutSection })), { ssr: true });
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((m) => ({ default: m.ContactSection })), { ssr: true });

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