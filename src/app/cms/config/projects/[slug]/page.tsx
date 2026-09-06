"use client";

import {
  AdminSaveButton,
  AdminShell,
  type AdminMessage,
} from "@/components/admin/AdminShell";
import { ProjectForm, type Project } from "@/components/admin/ProjectForm";
import { isPlaceholderSlug } from "@/lib/slug";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * One project, on its own page.
 *
 * It loads a single row and saves a single row. Nothing else about the site is in this
 * page's state, so there is nothing else it can overwrite — which is the whole reason
 * projects were moved out of the config blob.
 *
 * The slug in the URL is the row's current slug. Editing the slug field renames it, and
 * the save redirects here under the new one so the address bar never points at a
 * project that no longer answers to that name.
 */
export default function ProjectEditorPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [project, setProject] = useState<Project | null>(null);
  /**
   * Whether the slug still follows the title.
   *
   * On for a project created but never named — its slug is the placeholder the route
   * gave it, so nothing links to it and it is free to move. Off the moment the slug is
   * edited by hand, and off for every existing project, whose slug is a live URL.
   */
  const [autoSlug, setAutoSlug] = useState(false);
  /** Archived projects are still editable; the banner stops that being a surprise. */
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<AdminMessage>(null);

  const authed = useCallback(async (path: string, init?: RequestInit) => {
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
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await authed(`/api/projects/${slug}`);
        const body = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setMessage({
            type: "error",
            text:
              res.status === 404 ? "No project with that slug." : body.error,
          });
          return;
        }
        setProject(body.project.data);
        setAutoSlug(isPlaceholderSlug(body.project.slug));
        setArchived(!!body.project.archived_at);
      } catch {
        if (!cancelled) {
          setMessage({ type: "error", text: "Failed to load this project." });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, authed]);

  const save = async () => {
    if (!project) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await authed(`/api/projects/${slug}`, {
        method: "PUT",
        body: JSON.stringify({ project }),
      });
      const body = await res.json();

      if (!res.ok) {
        // Surfaced rather than swallowed: a duplicate slug, or a row deleted from
        // another tab. The editor this replaced reported success either way.
        setMessage({ type: "error", text: body.error ?? "Failed to save." });
        return;
      }

      setMessage({ type: "success", text: "Saved." });
      setTimeout(() => setMessage(null), 3000);

      // Saved under a real name, so the slug stops following the title: from here it is
      // a URL rather than a placeholder.
      if (!isPlaceholderSlug(body.project.slug)) setAutoSlug(false);

      if (body.project.slug !== slug) {
        router.replace(`/cms/config/projects/${body.project.slug}`);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title={project?.title || slug}
      description={`Editing one project · /projects/${project?.slug ?? slug}`}
      message={message}
      loading={loading}
      actions={
        <>
          <Link
            href="/cms/config/projects"
            className="rounded-[6px] border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            All projects
          </Link>
          <AdminSaveButton
            onClick={save}
            saving={saving}
            disabled={!project}
            label="Save project"
          />
        </>
      }
    >
      {project ? (
        <>
          {archived && (
            <p className="mb-6 rounded-[6px] bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              Archived. Edits save normally, but this project is off the site
              until it is restored from the projects list.
            </p>
          )}
          {autoSlug && (
            <p className="mb-6 rounded-[6px] bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
              New project. Give it a title — the URL follows from it until you
              edit the slug yourself.
            </p>
          )}
          <ProjectForm
            project={project}
            onChange={setProject}
            autoSlug={autoSlug}
            onSlugEdited={() => setAutoSlug(false)}
          />
        </>
      ) : (
        <p className="text-muted-foreground">
          This project could not be loaded.{""}
          <Link href="/cms/config/projects" className="underline">
            Back to all projects
          </Link>
          .
        </p>
      )}
    </AdminShell>
  );
}
