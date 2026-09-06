"use client";

import {
  ArrayField,
  SectionLabel,
  TextAreaField,
  TextField,
} from "@/components/admin/ConfigEditor";
import {
  CaseStudyEditor,
  type CaseStudy,
} from "@/components/admin/CaseStudyEditor";
import {
  ImageUploader,
  type UploadedImage,
} from "@/components/admin/ImageUploader";
import {
  ScreenshotGroups,
  type ScreenshotGroup,
} from "@/components/admin/ScreenshotGroups";
import { slugify } from "@/lib/slug";

export interface Project {
  id?: number;
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
    npm?: string;
    appStore?: string;
    playStore?: string;
  };
  highlights: string[];
  published?: boolean;
}

/** A blank project, for the Add flow. Drafts by default: nothing half-written ships. */
export function emptyProject(): Project {
  return {
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
  };
}

/**
 * The fields of a single project.
 *
 * Lifted out of the projects list when each project moved to a page of its own. It is
 * presentational on purpose — it holds no fetch and no save, so the page above decides
 * what a save means. That page writes one row.
 */
export function ProjectForm({
  project,
  onChange,
  autoSlug = false,
  onSlugEdited,
}: {
  project: Project;
  onChange: (next: Project) => void;
  /**
   * Mirror the title into the slug as it is typed. True only while a project has never
   * been named — once a slug exists it is a URL somebody may have linked to, and
   * quietly moving it when the title is reworded would break those links silently.
   */
  autoSlug?: boolean;
  /** Editing the slug by hand ends the mirroring, for good. */
  onSlugEdited?: () => void;
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

  const onUpdate = onChange;

  /**
   * A published project's slug is a live URL.
   *
   * /projects/<slug> is in the sitemap, indexed, and possibly linked from somewhere
   * outside this site. Renaming it does not redirect anything — it retires one URL and
   * creates another, and the only sign is a 404 nobody is watching for. So the field is
   * locked while the project is published, and unpublishing is the deliberate act that
   * unlocks it. The API enforces the same rule; this is the part that explains it.
   */
  const slugLocked = project.published !== false;

  const update = (field: string, value: unknown) => {
    if (field === "title" && autoSlug && !slugLocked) {
      const title = value as string;
      // A title of punctuation alone, or a title cleared back to nothing, leaves the
      // placeholder in place rather than an empty slug — a row still needs a key, and
      // an empty one would be rejected on save with an error about a field the person
      // was not editing.
      onUpdate({ ...project, title, slug: slugify(title) || project.slug });
      return;
    }
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Title"
          value={project.title}
          onChange={(v) => update("title", v)}
        />
        <TextField
          label="Slug — the URL, /projects/<slug>"
          value={project.slug}
          disabled={slugLocked}
          hint={
            slugLocked
              ? "Locked: this URL is live. Unpublish below to change it."
              : undefined
          }
          onChange={(v) => {
            onSlugEdited?.();
            update("slug", v);
          }}
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
      <div className="flex items-center justify-between rounded-[6px] border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Published</p>
          <p className="text-xs text-muted-foreground">
            Only published projects are visible on the site
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            update("published", project.published === false ? true : false)
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ${
            project.published !== false ? "bg-green-500" : "bg-border-strong"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow ring-0 transition-transform duration-200 ${
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
          className="h-32 w-auto rounded-[6px] border border-border object-cover"
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
          label="npm URL"
          value={project.links?.npm || ""}
          onChange={(v) => update("links.npm", v)}
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
        label='Gallery heading (blank uses"A look inside")'
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
              className="flex-1 rounded-[6px] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={() => {
                const s = (project.screenshots || []).filter((_, j) => j !== i);
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
            update("screenshots", [...(project.screenshots || []), ""]);
          }}
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
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
    </div>
  );
}
