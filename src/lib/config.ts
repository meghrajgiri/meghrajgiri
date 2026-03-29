import { createAdminClient } from "./supabase-admin";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Fetch a single config section from Supabase.
 */
export async function getConfig<T = any>(key: string): Promise<T> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data?.value) {
    console.error(`Config "${key}" not found:`, error?.message);
    return {} as T;
  }

  return data.value as T;
}

/**
 * Fetch all config sections from Supabase.
 */
export async function getAllConfig() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_config")
    .select("key, value")
    .returns<{ key: string; value: any }[]>();

  if (error || !data) {
    console.error("Failed to fetch site config:", error?.message);
    return {} as SiteConfig;
  }

  const config: Record<string, any> = {};
  for (const row of data) {
    config[row.key] = row.value;
  }

  return config as SiteConfig;
}

export interface SiteConfig {
  personal: {
    name: string;
    role: string;
    initials: string;
    email: string;
    location: string;
    tagline: string;
  };
  hero: {
    mainTitle: { line1: string; line2: string };
    description: string;
    highlightedTerms: { term1: string; term2: string };
    buttons: {
      primary: { text: string; href: string };
      secondary: { text: string; href: string };
    };
    stats: Array<{ value: string; number?: string; label: string; delay?: string }>;
    floatingSkills: string[];
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    description: string[];
    stats: Array<{ value: string; label: string }>;
    callToAction: { title: string; description: string; buttonText: string };
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    categories: Array<{
      title: string;
      icon: string;
      skills: Array<{ name: string; level: number; color: string }>;
    }>;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    projects: Array<{
      id: number;
      slug: string;
      title: string;
      description: string;
      longDescription: string;
      image: string;
      screenshots?: string[];
      technologies: string[];
      category: string;
      status: string;
      year: string;
      links: { demo?: string; github?: string; case_study?: string };
      highlights: string[];
      published?: boolean;
    }>;
    callToAction: { title: string; description: string; buttonText: string };
  };
  contact: {
    title: string;
    subtitle: string;
    contactInfo: { email: string; phone: string; location: string };
    availability: {
      status: string;
      responseTime: string;
      workingHours: string;
    };
    socialLinks: Array<{
      name: string;
      platform: string;
      url: string;
      icon: string;
      label: string;
    }>;
    form: {
      fields: Record<
        string,
        { label: string; placeholder: string; type?: string }
      >;
      submitButton: string;
      successMessage: string;
      errorMessage: string;
    };
  };
  education: {
    title: string;
    subtitle: string;
    education: Array<{
      id: number;
      logo: string;
      degree: string;
      field: string;
      institution: string;
      period: string;
      type: string;
      description: string;
      skills: string[];
    }>;
    highlights: Array<{ value: string; label: string }>;
  };
  experience: {
    experiences: Array<{
      year: string;
      period: string;
      title: string;
      company: string;
      type: string;
      description: string;
      technologies: string[];
      status: string;
    }>;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    url: string;
    siteName: string;
    twitter: string;
    locale: string;
    type: string;
  };
  navigation: {
    items: Array<{ href: string; label: string }>;
    mobileMenu: { footer: string };
  };
}

/**
 * Save a config section to Supabase (upsert).
 */
export async function saveConfig(key: string, value: unknown) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_config")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  if (error) throw error;
}
