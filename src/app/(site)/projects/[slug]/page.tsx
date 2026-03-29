import { getAllConfig } from "@/lib/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const config = await getAllConfig();
  return config.projects.projects
    .filter((p) => p.published !== false)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = await getAllConfig();
  const project = config.projects.projects.find((p) => p.slug === slug && p.published !== false);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const title = `${project.title} | Meghraj Giri`;
  const description = project.description;

  return {
    title,
    description,
    keywords: [
      ...project.technologies,
      project.category,
      "Meghraj Giri",
      "Portfolio",
    ],
    openGraph: {
      title,
      description,
      url: `${config.metadata.url}/projects/${project.slug}`,
      siteName: config.metadata.siteName,
      type: "article",
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: config.metadata.twitter,
      images: [project.image],
    },
    alternates: {
      canonical: `${config.metadata.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const config = await getAllConfig();
  const project = config.projects.projects.find((p) => p.slug === slug && p.published !== false);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.longDescription,
    image: project.image,
    author: {
      "@type": "Person",
      name: config.metadata.author,
      url: config.metadata.url,
    },
    dateCreated: project.year,
    genre: project.category,
    keywords: project.technologies.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail project={project} />
    </>
  );
}
