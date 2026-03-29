import { SITE_DATA } from "@/config";
import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects | Meghraj Giri - Full Stack Developer",
  description:
    "Explore my portfolio of projects spanning E-Commerce, Healthcare, Ed-Tech, Fin-Tech, and more. Built with React, Next.js, TypeScript, and modern technologies.",
  keywords: [
    "Projects",
    "Portfolio",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "Full Stack",
    "Meghraj Giri",
  ],
  openGraph: {
    title: "Projects | Meghraj Giri - Full Stack Developer",
    description:
      "Explore my portfolio of projects spanning E-Commerce, Healthcare, Ed-Tech, Fin-Tech, and more.",
    url: `${SITE_DATA.metadata.url}/projects`,
    siteName: SITE_DATA.metadata.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Meghraj Giri",
    description:
      "Explore my portfolio of projects spanning E-Commerce, Healthcare, Ed-Tech, Fin-Tech, and more.",
    creator: SITE_DATA.metadata.twitter,
  },
  alternates: {
    canonical: `${SITE_DATA.metadata.url}/projects`,
  },
};

export default function ProjectsPage() {
  const { projects, badge, title, subtitle, callToAction } =
    SITE_DATA.projects;

  return (
    <section className="min-h-screen px-6 pb-24 pt-32">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-16">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-sm dark:border-primary/10 dark:bg-primary/5">
              <span className="text-sm font-medium text-primary">{badge}</span>
            </div>
            <h1 className="text-gradient text-4xl font-bold md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {/* Client component for filtering + grid */}
          <ProjectsGrid projects={projects} />

          {/* CTA */}
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">{callToAction.title}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {callToAction.description}
            </p>
            <Link
              href="/#contact"
              className="bg-gradient focus-ring hover-lift inline-block rounded-lg px-8 py-4 font-semibold text-primary-foreground"
            >
              {callToAction.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
