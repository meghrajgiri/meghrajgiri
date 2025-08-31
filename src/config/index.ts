import { aboutConfig } from "./about";
import { contactConfig } from "./contact";
import { educationConfig } from "./education";
import { heroConfig } from "./hero";
import { metadataConfig } from "./metadata";
import { navigationConfig } from "./navigation";
import { personalConfig } from "./personal";
import { projectsConfig } from "./projects";
import { skillsConfig } from "./skills";

// Combined configuration object (optional - for when you need everything)
export const SITE_DATA = {
  personal: personalConfig,
  hero: heroConfig,
  navigation: navigationConfig,
  about: aboutConfig,
  skills: skillsConfig,
  projects: projectsConfig,
  contact: contactConfig,
  education: educationConfig,
  metadata: metadataConfig,
} as const;

export type SiteData = typeof SITE_DATA;
