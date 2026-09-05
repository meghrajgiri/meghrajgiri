"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { ImageSize } from "@/lib/image-size";

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  screenshots?: string[];
  screenshotsHeading?: string;
  technologies: string[];
  category: string;
  status: string;
  year: string;
  links: {
    demo?: string;
    github?: string;
    case_study?: string;
  };
  highlights: string[];
}

export function ProjectDetail({
  project,
  imageSizes = {},
  caseStudy,
}: {
  project: Project;
  /**
   * Server-rendered case-study body, slotted in as children so its Markdown is parsed
   * on the server. This component is only a client component because of the lightbox.
   */
  caseStudy?: React.ReactNode;
  /**
   * Intrinsic dimensions keyed by src, measured on the server. Absent entries fall
   * back to a plain `<img>` rather than a guessed aspect ratio.
   */
  imageSizes?: Record<string, ImageSize>;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const allImages = [
    project.image,
    ...(project.screenshots || []),
  ];

  return (
    <article className="min-h-screen px-6 pb-24 pt-32">
      <div className="container mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-brand rounded-md px-3 py-1 text-sm font-semibold text-[var(--brand-ink)]">
              {project.category}
            </span>
            <span className={`rounded-md px-3 py-1 text-sm font-medium ${
              project.status === "In Progress"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-green-500/10 text-green-600 dark:text-green-400"
            }`}>
              {project.status}
            </span>
            <span className="text-sm text-muted-foreground">{project.year}</span>
          </div>

          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground">
            {project.longDescription}
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand focus-ring hover-lift inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-[var(--brand-ink)]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring hover-lift inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-accent"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div
          className="mb-12 cursor-pointer overflow-hidden rounded-2xl bg-muted"
          onClick={() => setSelectedImage(project.image)}
        >
          {imageSizes[project.image] ? (
            <Image
              src={project.image}
              alt={project.title}
              width={imageSizes[project.image].width}
              height={imageSizes[project.image].height}
              // The hero is the largest element above the fold on this page, so it is
              // the LCP candidate and must not be lazy-loaded.
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto w-full transition-transform duration-500 hover:scale-[1.02]"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          )}
        </div>

        {caseStudy}

        {/* Technologies & Highlights */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* Technologies */}
          <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-border/50 bg-muted px-3 py-1.5 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {project.highlights.length > 0 && (
            <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold">Key Highlights</h2>
              <ul className="space-y-2">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* The gallery.
 
            "Screenshots" names the file format rather than what the reader is about to
            see, and it is the same word whether the images are three phone screens or
            fourteen dashboards. The default says what they are looking at instead, and
            any project can override it — a mobile app reads better as "In the app"
            than a clinic dashboard does. */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {project.screenshotsHeading?.trim() || "A look inside"}
            </h2>
            {/* Masonry rather than a uniform grid.
 
                These screenshots are not one shape: phone captures run about 1:2.2
                portrait and dashboard captures about 16:9, and the previous
                `aspect-video object-cover` forced every one of them into the same 16:9
                box. On a landscape capture that trimmed the edges; on a portrait one it
                threw away roughly two thirds of the image, which on a phone screenshot
                is the part carrying the content.
 
                CSS columns let each image keep its own height. Reading order becomes
                top-to-bottom within a column rather than left-to-right, which is the
                trade — acceptable for a gallery where the images are peers rather than
                a sequence. */}
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {project.screenshots.map((src, index) => {
                const size = imageSizes[src];
                return (
                  <div
                    key={src}
                    className="mb-4 block cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-muted"
                    onClick={() => setSelectedImage(src)}
                  >
                    {size ? (
                      <Image
                        src={src}
                        alt={`${project.title} screenshot ${index + 1}`}
                        width={size.width}
                        height={size.height}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-auto w-full transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      /* Without recorded dimensions `next/image` would reserve a box at
                         a guessed ratio and jump once the real image loaded. A plain
                         img reserves nothing and still shows the whole frame. */
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={src}
                        alt={`${project.title} screenshot ${index + 1}`}
                        loading="lazy"
                        className="h-auto w-full transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Deliberately not next/image: the lightbox exists to show the asset at
                full resolution, which is the one case where a resized derivative is
                the wrong thing to serve. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={project.title}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = allImages.indexOf(selectedImage);
                    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                    setSelectedImage(allImages[prevIndex]);
                  }}
                  aria-label="Previous image"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = allImages.indexOf(selectedImage);
                    const nextIndex = (currentIndex + 1) % allImages.length;
                    setSelectedImage(allImages[nextIndex]);
                  }}
                  aria-label="Next image"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
