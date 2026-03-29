import { SITE_DATA } from "@/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

function getProject(slug: string) {
  return SITE_DATA.projects.projects.find((p) => p.slug === slug);
}

export async function generateStaticParams() {
  return SITE_DATA.projects.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

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
      url: `${SITE_DATA.metadata.url}/projects/${project.slug}`,
      siteName: SITE_DATA.metadata.siteName,
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
      creator: SITE_DATA.metadata.twitter,
      images: [project.image],
    },
    alternates: {
      canonical: `${SITE_DATA.metadata.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.longDescription,
    image: project.image,
    author: {
      "@type": "Person",
      name: SITE_DATA.metadata.author,
      url: SITE_DATA.metadata.url,
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
