import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { getAllConfig } from "@/lib/config";
import { buildPerson, buildProfilePage, buildWebSite, graph } from "@/lib/schema";

const BioStrip = dynamic(() => import("@/components/sections/BioStrip").then((m) => ({ default: m.BioStrip })), { ssr: true });
const ContactCTA = dynamic(() => import("@/components/sections/ContactCTA").then((m) => ({ default: m.ContactCTA })), { ssr: true });

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
          {/* Four sections, down from six.
              
              Work first and work biggest — a portfolio leads with the work and keeps
              the selling short. What changed is how much of the page the work gets:
              the stack logo grid, the testimonial rail and the second contact form
              are gone, and featured projects went from three to six to fill the space
              they were occupying.
              
              Each cut removed a duplicate or a dead section rather than content:
              the logo grid restated what every case study already lists and `/skills`
              covers properly; the testimonial rail rendered nothing, because every
              stored testimonial is an unattributed placeholder; the About spread was
              `/about` verbatim; and the contact form was `/contact` verbatim. */}
          <ProjectsSection />
          <BioStrip />
          <ContactCTA />
        </div>
      </div>
    </>
  );
}
