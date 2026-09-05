import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { getAllConfig } from "@/lib/config";
import { buildPerson, buildProfilePage, buildWebSite, graph } from "@/lib/schema";

const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection").then((m) => ({ default: m.SkillsSection })), { ssr: true });
const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then((m) => ({ default: m.AboutSection })), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })), { ssr: true });
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((m) => ({ default: m.ContactSection })), { ssr: true });

export default async function Home() {
  const config = await getAllConfig();

  // `ProfilePage` is what marks this URL as being *about* the person rather than
  // merely mentioning them — the distinction a search engine needs before it will
  // attribute a claim to a specific Meghraj.
  const jsonLd = graph([
    buildPerson(config),
    buildWebSite(config),
    buildProfilePage(config),
  ]);

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
          {/* Work first and work biggest. The previous order — pitch, work, a
              features-style tech grid, about, a contact form — is landing-page
              anatomy. A portfolio leads with the work and keeps the selling short. */}
          <ProjectsSection />
          <AboutSection />
          <TestimonialsSection />
          <SkillsSection />
          <ContactSection />
        </div>
      </div>
    </>
  );
}