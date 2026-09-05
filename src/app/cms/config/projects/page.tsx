"use client";

import {
  ConfigEditor,
  TextField,
  TextAreaField,
  SectionLabel,
  ArrayField,
} from "@/components/admin/ConfigEditor";
import { CaseStudyEditor, type CaseStudy } from "@/components/admin/CaseStudyEditor";
import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import { ScreenshotGroups, type ScreenshotGroup } from "@/components/admin/ScreenshotGroups";
import { useState } from "react";

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  screenshots?: string[];
  screenshotsHeading?: string;
  screenshotGroups?: ScreenshotGroup[];
  imageSizes?: Record<string, { width: number; height: number }>;
  caseStudy?: CaseStudy;
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
  published?: boolean;
}

function ProjectCard({
  project,
  index,
  onUpdate,
  onRemove,
  isExpanded,
  onToggle,
}: {
  project: Project;
  index: number;
  onUpdate: (updated: Project) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  /**
   * Record dimensions for newly uploaded images.
   *
   * Kept beside the URLs rather than derived at render time: the images are remote
   * now, so the server cannot read their headers, and `next/image` needs real
   * width/height or the page shifts as each one loads.
   */
  const withSizes = (images: UploadedImage[]) => {
    const sizes = { ...(project.imageSizes ?? {}) };
    for (const img of images) {
      if (img.width && img.height) {
        sizes[img.url] = { width: img.width, height: img.height };
      }
    }
    return sizes;
  };

  const update = (field: string, value: unknown) => {
    if (field.startsWith("links.")) {
      const linkKey = field.split(".")[1];
      onUpdate({
        ...project,
        links: { ...project.links, [linkKey]: value },
      });
    } else {
      onUpdate({ ...project, [field]: value });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Collapsed header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-500 dark:bg-gray-800">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {project.title || "Untitled Project"}
            </p>
            <p className="text-xs text-gray-500">
              {project.category} &middot; {project.year} &middot;{" "}
              {project.status}
            </p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              project.published !== false
                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {project.published !== false ? "Published" : "Draft"}
          </span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded form */}
      {isExpanded && (
        <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title"
              value={project.title}
              onChange={(v) => update("title", v)}
            />
            <TextField
              label="Slug"
              value={project.slug}
              onChange={(v) => update("slug", v)}
            />
          </div>

          <TextAreaField
            label="Short Description"
            value={project.description}
            onChange={(v) => update("description", v)}
            rows={2}
          />

          <TextAreaField
            label="Long Description"
            value={project.longDescription}
            onChange={(v) => update("longDescription", v)}
            rows={4}
          />

          <div className="grid grid-cols-3 gap-4">
            <TextField
              label="Category"
              value={project.category}
              onChange={(v) => update("category", v)}
            />
            <TextField
              label="Year"
              value={project.year}
              onChange={(v) => update("year", v)}
            />
            <TextField
              label="Status"
              value={project.status}
              onChange={(v) => update("status", v)}
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Published</p>
              <p className="text-xs text-gray-500">Only published projects are visible on the site</p>
            </div>
            <button
              type="button"
              onClick={() => update("published", project.published === false ? true : false)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                project.published !== false
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
                  project.published !== false ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <SectionLabel>Thumbnail</SectionLabel>
          {project.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={project.image}
              alt=""
              className="h-32 w-auto rounded-lg border border-gray-200 object-cover dark:border-gray-800"
            />
          )}
          <ImageUploader
            folder={project.slug}
            label="Upload thumbnail"
            onUploaded={(images) => {
              const first = images[0];
              if (!first) return;
              onUpdate({
                ...project,
                image: first.url,
                imageSizes: withSizes(images),
              });
            }}
          />
          <TextField
            label="Thumbnail URL"
            value={project.image}
            onChange={(v) => update("image", v)}
          />

          <ArrayField
            label="Technologies"
            value={project.technologies}
            onChange={(v) => update("technologies", v)}
          />

          <ArrayField
            label="Highlights"
            value={project.highlights}
            onChange={(v) => update("highlights", v)}
          />

          <SectionLabel>Links</SectionLabel>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Live Demo URL"
              value={project.links?.demo || ""}
              onChange={(v) => update("links.demo", v)}
            />
            <TextField
              label="GitHub URL"
              value={project.links?.github || ""}
              onChange={(v) => update("links.github", v)}
            />
            <TextField
              label="App Store URL"
              value={project.links?.appStore || ""}
              onChange={(v) => update("links.appStore", v)}
            />
            <TextField
              label="Google Play URL"
              value={project.links?.playStore || ""}
              onChange={(v) => update("links.playStore", v)}
            />
          </div>

          <SectionLabel>Gallery</SectionLabel>
          <TextField
            label='Gallery heading (blank uses "A look inside")'
            value={project.screenshotsHeading || ""}
            onChange={(v) => update("screenshotsHeading", v)}
          />
          <div className="space-y-2">
            {(project.screenshots || []).map((src, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={src}
                  onChange={(e) => {
                    const s = [...(project.screenshots || [])];
                    s[i] = e.target.value;
                    update("screenshots", s);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
                />
                <button
                  onClick={() => {
                    const s = (project.screenshots || []).filter(
                      (_, j) => j !== i,
                    );
                    update("screenshots", s);
                  }}
                  className="rounded px-2 py-2 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <ImageUploader
              folder={project.slug}
              multiple
              label="Upload screenshots"
              onUploaded={(images) => {
                onUpdate({
                  ...project,
                  screenshots: [
                    ...(project.screenshots || []),
                    ...images.map((i) => i.url),
                  ],
                  imageSizes: withSizes(images),
                });
              }}
            />
            <button
              onClick={() => {
                update("screenshots", [
                  ...(project.screenshots || []),
                  "",
                ]);
              }}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            >
              + Add screenshot URL manually
            </button>
          </div>

          <ScreenshotGroups
            slug={project.slug}
            groups={project.screenshotGroups ?? []}
            ungrouped={(project.screenshots ?? []).filter(
              (src) =>
                !(project.screenshotGroups ?? []).some((g) =>
                  g.images?.includes(src),
                ),
            )}
            onChange={(groups) => update("screenshotGroups", groups)}
            onSizes={(images) => {
              // Uploads made inside a group still need their dimensions recorded, and
              // the URLs added to `screenshots` so the flat list stays the full set.
              onUpdate({
                ...project,
                imageSizes: withSizes(images),
                screenshots: [
                  ...(project.screenshots ?? []),
                  ...images.map((i) => i.url),
                ],
              });
            }}
          />

          <CaseStudyEditor
            caseStudy={project.caseStudy ?? {}}
            onChange={(cs) => update("caseStudy", cs)}
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={onRemove}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Remove Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsConfigPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <ConfigEditor
      configKey="projects"
      title="Projects"
      description="Manage all projects, their details, images, and links"
    >
      {({ config, updateField }) => {
        const projects = (config.projects as Project[]) || [];
        const cta = config.callToAction as Record<string, string>;

        const addProject = () => {
          const newId =
            projects.length > 0
              ? Math.max(...projects.map((p) => p.id)) + 1
              : 1;
          const updated = [
            ...projects,
            {
              id: newId,
              slug: "",
              title: "",
              description: "",
              longDescription: "",
              image: "",
              screenshots: [],
              technologies: [],
              category: "",
              status: "Completed",
              year: new Date().getFullYear().toString(),
              links: {},
              highlights: [],
              published: false,
            },
          ];
          updateField("projects", updated);
          setExpandedIndex(updated.length - 1);
        };

        const updateProject = (index: number, updated: Project) => {
          const p = [...projects];
          p[index] = updated;
          updateField("projects", p);
        };

        const removeProject = (index: number) => {
          updateField(
            "projects",
            projects.filter((_, i) => i !== index),
          );
          setExpandedIndex(null);
        };

        return (
          <div className="space-y-6">
            <TextField
              label="Badge"
              value={config.badge as string}
              onChange={(v) => updateField("badge", v)}
            />
            <TextField
              label="Title"
              value={config.title as string}
              onChange={(v) => updateField("title", v)}
            />
            <TextAreaField
              label="Subtitle"
              value={config.subtitle as string}
              onChange={(v) => updateField("subtitle", v)}
            />

            <SectionLabel>
              Projects ({projects.length})
            </SectionLabel>

            <button
              onClick={addProject}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-100 dark:hover:text-gray-100"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Project
            </button>

            <div className="space-y-3">
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.id || i}
                  project={project}
                  index={i}
                  onUpdate={(updated) => updateProject(i, updated)}
                  onRemove={() => removeProject(i)}
                  isExpanded={expandedIndex === i}
                  onToggle={() =>
                    setExpandedIndex(expandedIndex === i ? null : i)
                  }
                />
              ))}
            </div>

            <SectionLabel>Call to Action</SectionLabel>
            <TextField
              label="CTA Title"
              value={cta?.title}
              onChange={(v) => updateField("callToAction.title", v)}
            />
            <TextAreaField
              label="CTA Description"
              value={cta?.description}
              onChange={(v) => updateField("callToAction.description", v)}
            />
            <TextField
              label="CTA Button Text"
              value={cta?.buttonText}
              onChange={(v) => updateField("callToAction.buttonText", v)}
            />
          </div>
        );
      }}
    </ConfigEditor>
  );
}
