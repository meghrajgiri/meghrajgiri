"use client";

import { SectionLabel, TextField } from "@/components/admin/ConfigEditor";
import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";

export type ScreenshotGroup = {
  heading: string;
  caption?: string;
  images: string[];
};

/**
 * Gallery grouping.
 *
 * A project carries four to seventeen screenshots. Shown as one run they ask the reader
 * to work out what each one is; grouped under a heading they read as a tour.
 *
 * Grouping is optional and additive: the flat `screenshots` list stays the source of
 * truth for a project that has not been organised, and the page falls back to it when
 * there are no groups. That matters because six of the eight projects were written
 * before this existed.
 */
export function ScreenshotGroups({
  slug,
  groups,
  ungrouped,
  onChange,
  onSizes,
}: {
  slug: string;
  groups: ScreenshotGroup[];
  /** Images from the flat list that no group has claimed yet. */
  ungrouped: string[];
  onChange: (groups: ScreenshotGroup[]) => void;
  /** Record dimensions for newly uploaded images. */
  onSizes: (images: UploadedImage[]) => void;
}) {
  const set = (i: number, patch: Partial<ScreenshotGroup>) => {
    const next = [...groups];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const move = (i: number, delta: number) => {
    const next = [...groups];
    const j = i + delta;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <SectionLabel>Gallery groups</SectionLabel>
      <p className="-mt-2 text-xs text-gray-500">
        Optional. With no groups the gallery shows every screenshot in one run, exactly
        as before. Images not in any group are listed at the bottom.
      </p>

      {groups.map((group, i) => (
        <div
          key={i}
          className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
        >
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-4">
              <TextField
                label="Heading"
                value={group.heading}
                onChange={(v) => set(i, { heading: v })}
              />
              <TextField
                label="Caption (optional)"
                value={group.caption ?? ""}
                onChange={(v) => set(i, { caption: v })}
              />
            </div>
            <div className="flex gap-1 pt-6">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                className="rounded px-2 py-2 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                aria-label="Move group up"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === groups.length - 1}
                onClick={() => move(i, 1)}
                className="rounded px-2 py-2 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                aria-label="Move group down"
              >
                ↓
              </button>
            </div>
          </div>

          {group.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {group.images.map((src, j) => (
                <div key={src} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="h-20 w-20 rounded border border-gray-200 object-cover dark:border-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(i, { images: group.images.filter((_, k) => k !== j) })
                    }
                    title="Remove from this group"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white dark:bg-white dark:text-gray-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {ungrouped.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Add an existing screenshot
              </label>
              <div className="flex flex-wrap gap-2">
                {ungrouped.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => set(i, { images: [...group.images, src] })}
                    title="Add to this group"
                    className="opacity-60 transition-opacity hover:opacity-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-14 w-14 rounded border border-dashed border-gray-300 object-cover dark:border-gray-700"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <ImageUploader
            folder={slug}
            multiple
            label="Upload into this group"
            onUploaded={(images) => {
              onSizes(images);
              set(i, { images: [...group.images, ...images.map((x) => x.url)] });
            }}
          />

          <button
            type="button"
            onClick={() => onChange(groups.filter((_, k) => k !== i))}
            className="text-xs text-red-600 hover:underline dark:text-red-400"
          >
            Remove group (images stay in the project)
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...groups, { heading: "", caption: "", images: [] }])}
        className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400"
      >
        + Add group
      </button>

      {groups.length > 0 && ungrouped.length > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-500">
          {ungrouped.length} screenshot{ungrouped.length === 1 ? "" : "s"} not in any
          group. Once a project has groups, only grouped images are shown — add these to
          a group or remove them from the project.
        </p>
      )}
    </div>
  );
}
