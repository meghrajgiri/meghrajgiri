"use client";

import {
  ConfigEditor,
  SectionLabel,
  TextAreaField,
  TextField,
} from "@/components/admin/ConfigEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { emptyProject } from "@/components/admin/ProjectForm";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ProjectRow = {
  slug: string;
  published: boolean;
  archived_at: string | null;
  updated_at: string;
  data: { title: string; category: string; year: string; status: string };
};

/**
 * The projects list.
 *
 * The heading fields around it still belong to the `projects` section in `site_config`
 * and are written by `ConfigEditor`'s Save button. The list does not: add, delete and
 * reorder each write immediately, to their own rows, through `/api/projects`. A
 * project's own content is edited on its own page.
 *
 * That split is the point. This page used to hold all fourteen projects in React state
 * and post the whole array back, so any save overwrote every project with whatever this
 * tab had loaded — which is how a rewritten case study was silently reverted to an
 * older copy by an unrelated image upload.
 */
function ProjectList() {
  const router = useRouter();
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * The row the archive dialog is asking about, or null when it is closed.
   *
   * Only published projects get asked. Archiving is reversible, so a confirmation on a
   * draft is friction with nothing behind it — but archiving something published takes a
   * live URL off the site, and that is worth a sentence before it happens.
   */
  const [pendingArchive, setPendingArchive] = useState<ProjectRow | null>(null);

  const authed = async (path: string, init?: RequestInit) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
        ...(init?.headers ?? {}),
      },
    });
  };

  const load = useCallback(async () => {
    try {
      const res = await authed("/api/projects");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load projects");
      setRows(body.projects);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Create an empty draft and go straight to it.
   *
   * Nothing is asked for here. Naming a project is the first thing you do on its own
   * page, where the field is in front of you and the slug it produces is visible — not
   * in a dialog that blocks the page to collect one value before the thing it names
   * exists.
   */
  const add = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await authed("/api/projects", {
        method: "POST",
        body: JSON.stringify({ project: emptyProject() }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to add project");
      router.push(`/cms/config/projects/${body.project.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add project");
      setBusy(false);
    }
  };

  /**
   * Archive or restore, in place of deleting.
   *
   * Nothing is removed: the row, its case study and its uploaded images all stay. The
   * project simply stops being part of the site, and comes back the same way it left.
   */
  const setArchived = async (row: ProjectRow, archived: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const res = await authed(`/api/projects/${row.slug}`, {
        method: "PATCH",
        body: JSON.stringify({ archived }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error ?? `Failed to ${archived ? "archive" : "restore"} project`,
        );
      }
      setPendingArchive(null);
      await load();
    } catch (e) {
      // The dialog stays open on failure. Closing it would leave the row still listed
      // with an error above it, and no obvious way to work out which one failed.
      setError(
        e instanceof Error
          ? e.message
          : `Failed to ${archived ? "archive" : "restore"} project`,
      );
    } finally {
      setBusy(false);
    }
  };

  /** Published projects are asked about; drafts archive on the spot. */
  const archive = (row: ProjectRow) =>
    row.published ? setPendingArchive(row) : setArchived(row, true);

  const move = async (index: number, delta: number) => {
    if (!rows) return;
    const next = [...rows];
    const j = index + delta;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];

    // Shown before the write returns, and put back from the server if it fails. The
    // reorder sends only positions, so it cannot carry project content with it.
    setRows(next);
    setBusy(true);
    setError(null);
    try {
      const res = await authed("/api/projects", {
        method: "PATCH",
        body: JSON.stringify({ slugs: next.map((r) => r.slug) }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to reorder");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reorder");
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (!rows) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  }

  const active = rows.filter((row) => !row.archived_at);
  const archived = rows.filter((row) => row.archived_at);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionLabel>Projects ({active.length})</SectionLabel>
        <button
          onClick={add}
          disabled={busy}
          className="rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-100 dark:hover:text-gray-100"
        >
          + Add project
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Add, archive and reorder save immediately. Everything else about a project is
        edited on its own page, and saves only that project.
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {active.map((row, i) => (
          <div
            key={row.slug}
            className="flex items-center gap-3 bg-white px-4 py-3 dark:bg-gray-950"
          >
            <div className="flex flex-col">
              <button
                onClick={() => move(i, -1)}
                disabled={busy || i === 0}
                aria-label={`Move ${row.data.title || row.slug} up`}
                className="px-1 text-xs leading-none text-gray-400 hover:text-gray-900 disabled:opacity-25 dark:hover:text-gray-100"
              >
                ↑
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={busy || i === active.length - 1}
                aria-label={`Move ${row.data.title || row.slug} down`}
                className="px-1 text-xs leading-none text-gray-400 hover:text-gray-900 disabled:opacity-25 dark:hover:text-gray-100"
              >
                ↓
              </button>
            </div>

            <button
              onClick={() => router.push(`/cms/config/projects/${row.slug}`)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {row.data.title || row.slug}
              </p>
              <p className="truncate text-xs text-gray-500">
                /{row.slug}
                {row.data.category ? ` · ${row.data.category}` : ""}
                {row.data.year ? ` · ${row.data.year}` : ""}
              </p>
            </button>

            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                row.published
                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {row.published ? "Published" : "Draft"}
            </span>

            <button
              onClick={() => router.push(`/cms/config/projects/${row.slug}`)}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Edit
            </button>
            <button
              onClick={() => archive(row)}
              disabled={busy}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:text-amber-500 dark:hover:bg-amber-950/30"
            >
              Archive
            </button>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div className="pt-4">
          <SectionLabel>Archived ({archived.length})</SectionLabel>
          <p className="mb-3 mt-1 text-xs text-gray-500">
            Off the site and out of the sitemap. Everything is kept — the case study and
            the uploaded images included — and Restore puts it back where it was.
          </p>
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-dashed border-gray-300 dark:divide-gray-800 dark:border-gray-700">
            {archived.map((row) => (
              <div
                key={row.slug}
                className="flex items-center gap-3 bg-gray-50 px-4 py-3 dark:bg-gray-900/40"
              >
                <button
                  onClick={() => router.push(`/cms/config/projects/${row.slug}`)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {row.data.title || row.slug}
                  </p>
                  <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                    /{row.slug} · archived{" "}
                    {new Date(row.archived_at!).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </button>
                <button
                  onClick={() => setArchived(row, false)}
                  disabled={busy}
                  className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingArchive}
        title={`Archive "${pendingArchive?.data.title || pendingArchive?.slug}"?`}
        confirmLabel="Archive"
        body={
          <>
            <p>
              It comes off the site and out of the sitemap.{" "}
              <span className="font-medium">Nothing is deleted</span> — the case study and
              the uploaded images are kept, and you can restore it from the archived list.
            </p>
            <p className="mt-2">
              It is published, so /projects/{pendingArchive?.slug} will start returning
              404 until it is restored.
            </p>
          </>
        }
        busy={busy}
        onConfirm={() => pendingArchive && setArchived(pendingArchive, true)}
        onCancel={() => setPendingArchive(null)}
      />
    </div>
  );
}

export default function ProjectsConfigPage() {
  return (
    <ConfigEditor
      configKey="projects"
      title="Projects"
      description="The section heading, and the list of projects"
    >
      {({ config, updateField }) => {
        const cta = config.callToAction as Record<string, string>;

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

            <ProjectList />

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
