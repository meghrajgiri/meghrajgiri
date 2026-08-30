import { getAllConfig } from "@/lib/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getImageSizes } from "@/lib/image-size";
import { buildBreadcrumbs, buildPerson, graph, personId } from "@/lib/schema";

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
      // No `images` here on purpose. Declaring one overrides the generated card in
      // opengraph-image.tsx, and `project.image` is a screenshot with an arbitrary
      // aspect ratio that social platforms crop unpredictably.
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: config.metadata.twitter,
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

  const baseUrl = config.metadata.url;
  const imageSizes = await getImageSizes([
    project.image,
    ...(project.screenshots ?? []),
  ]);

  const jsonLd = graph([
    buildPerson(config),
    buildBreadcrumbs(baseUrl, [
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: project.title, path: `/projects/${project.slug}` },
    ]),
    {
      "@type": "CreativeWork",
      "@id": `${baseUrl}/projects/${project.slug}#work`,
      name: project.title,
      description: project.longDescription,
      url: `${baseUrl}/projects/${project.slug}`,
      image: project.image?.startsWith("http")
        ? project.image
        : `${baseUrl}${project.image}`,
      // Reference the Person node by id instead of describing the author inline, so
      // every project resolves back to the same entity.
      author: { "@id": personId(baseUrl) },
      dateCreated: project.year,
      genre: project.category,
      keywords: project.technologies.join(", "),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail project={project} imageSizes={imageSizes} />
    </>
  );
}
