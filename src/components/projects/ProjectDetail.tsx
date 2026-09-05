"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  screenshotGroups?: Array<{
    heading: string;
    caption?: string;
    images: string[];
  }>;
  technologies: string[];
  category: string;
  status: string;
  year: string;
  links: {
    demo?: string;
    github?: string;
    case_study?: string;
    appStore?: string;
    playStore?: string;
  };
  highlights: string[];
}

/**
 * The image grid, shared by the grouped and ungrouped galleries.
 *
 * CSS columns rather than a uniform grid: these screenshots are not one shape — phone
 * captures run about 1:2.2 portrait and dashboard captures about 16:9 — and forcing
 * every one into the same box trimmed the wide ones and threw away most of the tall
 * ones. Reading order becomes top-to-bottom within a column, which is the trade.
 */
function Masonry({
  images,
  project,
  imageSizes,
  onSelect,
}: {
  images: string[];
  project: Project;
  imageSizes: Record<string, ImageSize>;
  onSelect: (src: string) => void;
}) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {images.map((src, index) => {
        const size = imageSizes[src];
        return (
          <div
            key={src}
            className="mb-4 block cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-muted"
            onClick={() => onSelect(src)}
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
              /* Without recorded dimensions `next/image` would reserve a box at a
                 guessed ratio and jump once the real image loaded. A plain img
                 reserves nothing and still shows the whole frame. */
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
  );
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

  // Escape closes the topmost layer, and the page behind an overlay must not scroll —
  // neither was handled before, so the lightbox trapped you into clicking the backdrop
  // and the article scrolled underneath it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedImage) setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedImage]);

  useEffect(() => {
    const locked = selectedImage !== null;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  const groups = (project.screenshotGroups ?? []).filter(
    (g) => g.images?.length > 0,
  );

  // Any image the gallery renders, in the order it is rendered. The lightbox pages
  // through this, so it has to span every group — otherwise the arrows dead-end at a
  // group boundary.
  const galleryImages =
    groups.length > 0
      ? groups.flatMap((g) => g.images)
      : (project.screenshots ?? []);

  const allImages = [project.image, ...galleryImages];

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
            <span className="rounded-md bg-brand px-3 py-1 text-sm font-semibold text-[var(--brand-ink)]">
              {project.category}
            </span>
            <span
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                project.status === "In Progress"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-green-500/10 text-green-600 dark:text-green-400"
              }`}
            >
              {project.status}
            </span>
            <span className="text-sm text-muted-foreground">
              {project.year}
            </span>
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
                className="focus-ring hover-lift inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-[var(--brand-ink)]"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
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
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Source Code
              </a>
            )}
            {/* A store listing is the one link a reader can check without taking the
                claim on trust: it proves the app passed review and is installable. */}
            {project.links.appStore && (
              <a
                href={project.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring hover-lift inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-accent"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M17.05 12.04c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.79-.41 6.92 1.15 9.19.76 1.11 1.67 2.36 2.86 2.31 1.15-.05 1.58-.74 2.97-.74 1.39 0 1.78.74 2.99.72 1.24-.02 2.02-1.13 2.78-2.24.87-1.28 1.23-2.52 1.25-2.59-.03-.01-2.4-.92-2.42-3.65zM14.8 4.9c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.09 1.77-.95 2.81 1.02.08 2.05-.52 2.68-1.28z" />
                </svg>
                App Store
              </a>
            )}
            {project.links.playStore && (
              <a
                href={project.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring hover-lift inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-accent"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M3.6 1.8a1 1 0 00-.5.9v18.6a1 1 0 00.5.9l10-10.2-10-10.2zm11.1 11.3l2.9 2.9-11.3 6.5 8.4-9.4zm0-2.2L6.3 1.5l11.3 6.5-2.9 2.9zm4.2 1.1l2.5-1.4a1 1 0 010 1.8l-2.5 1.4-1.6-1.6 1.6-1.6z" />
                </svg>
                Google Play
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
          <div className="border-border/50 bg-card/50 space-y-4 rounded-xl border p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="border-border/50 rounded-lg border bg-muted px-3 py-1.5 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {project.highlights.length > 0 && (
            <div className="border-border/50 bg-card/50 space-y-4 rounded-xl border p-6 backdrop-blur-sm">
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

        {/* The gallery, inline and at each image's own aspect ratio.

            A "+N" tile behind a modal kept the page short, but it put the work one
            click away and cropped the thumbnails square to do it. These screenshots
            are the evidence behind the case study — they should be readable while
            reading it, not filed behind an overlay.

            Groups are optional. With none, the flat list renders as one run. */}
        {galleryImages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {project.screenshotsHeading?.trim() || "A look inside"}
            </h2>

            {groups.length > 0 ? (
              <div className="space-y-12">
                {groups.map((group) => (
                  <section key={group.heading} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{group.heading}</h3>
                      {group.caption?.trim() && (
                        <p className="mt-1 max-w-[62ch] text-[15px] text-muted-foreground">
                          {group.caption}
                        </p>
                      )}
                    </div>
                    <Masonry
                      images={group.images}
                      project={project}
                      imageSizes={imageSizes}
                      onSelect={setSelectedImage}
                    />
                  </section>
                ))}
              </div>
            ) : (
              <Masonry
                images={galleryImages}
                project={project}
                imageSizes={imageSizes}
                onSelect={setSelectedImage}
              />
            )}
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
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
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
                    const prevIndex =
                      (currentIndex - 1 + allImages.length) % allImages.length;
                    setSelectedImage(allImages[prevIndex]);
                  }}
                  aria-label="Previous image"
                >
                  <svg
                    className="h-5 w-5"
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
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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
