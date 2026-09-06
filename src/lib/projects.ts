import { createAdminClient } from "./supabase-admin";
import type { SiteConfig } from "./config";

export type Project = SiteConfig["projects"]["projects"][number];

/** A project row as the CMS sees it: the project plus the columns around it. */
export type ProjectRow = {
  id: number;
  position: number;
  slug: string;
  published: boolean;
  /** When it was archived, or null while it is active. */
  archived_at: string | null;
  updated_at: string;
  data: Project;
};

const COLUMNS = "id, position, slug, published, archived_at, updated_at, data";

/**
 * Row-level access to projects.
 *
 * Projects used to live inside one JSONB array in `site_config`. Editing any of them
 * meant sending all of them back, so a save made from a page loaded before someone
 * else's save silently reverted it. Every function here touches exactly one row, or
 * touches many rows in a way that only writes what changed.
 *
 * `data` holds the project in the shape the site already reads. That is deliberate:
 * `getAllConfig` composes the same array it always returned, so no renderer, type or
 * consumer of the snapshot had to change when the storage did.
 */

/**
 * Every project, in display order.
 *
 * Includes drafts, and by default includes archived ones — the CMS has to list what it
 * can restore. Callers speaking for the public site pass `activeOnly`.
 */
export async function listProjects({ activeOnly = false } = {}): Promise<ProjectRow[]> {
  const supabase = createAdminClient();
  let query = supabase.from("projects").select(COLUMNS);
  if (activeOnly) query = query.is("archived_at", null);

  const { data, error } = await query
    .order("position", { ascending: true })
    .returns<ProjectRow[]>();

  if (error) throw error;
  return data ?? [];
}

/**
 * Archive or restore.
 *
 * Archiving takes a project off the site and leaves everything else intact — the row, the
 * case study, the images. It is the reversible half of removal, and the only kind the CMS
 * offers: nothing here is urgent enough to be one click from unrecoverable.
 */
export async function setProjectArchived(
  slug: string,
  archived: boolean,
): Promise<ProjectRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("slug", slug)
    .select(COLUMNS)
    .maybeSingle<ProjectRow>();

  if (error) throw error;
  return data;
}

export async function getProject(slug: string): Promise<ProjectRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select(COLUMNS)
    .eq("slug", slug)
    .maybeSingle<ProjectRow>();

  if (error) throw error;
  return data;
}

/**
 * Append a project.
 *
 * Position is computed from the current maximum rather than the caller's count, which
 * would be a stale number the moment two tabs are open.
 */
export async function createProject(project: Project): Promise<ProjectRow> {
  const supabase = createAdminClient();

  const { data: last } = await supabase
    .from("projects")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle<{ position: number }>();

  const { data, error } = await supabase
    .from("projects")
    .insert({ position: (last?.position ?? -1) + 1, data: project })
    .select(COLUMNS)
    .single<ProjectRow>();

  if (error) throw error;
  return data;
}

/**
 * Replace one project's content.
 *
 * Addressed by its current slug, so renaming a slug is an ordinary edit: the `data`
 * carries the new one and the generated column follows. Returns null when the slug
 * matches nothing, which the route turns into a 404 rather than a silent no-op —
 * a save that quietly saves nothing is the failure this whole change exists to remove.
 */
export async function updateProject(
  slug: string,
  project: Project,
): Promise<ProjectRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ data: project })
    .eq("slug", slug)
    .select(COLUMNS)
    .maybeSingle<ProjectRow>();

  if (error) throw error;
  return data;
}

/** Returns false when the slug matched nothing, so the caller can 404. */
export async function deleteProject(slug: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("slug", slug)
    .select("id")
    .maybeSingle<{ id: number }>();

  if (error) throw error;
  return !!data;
}

/**
 * Reorder by slug.
 *
 * Takes the full ordered list and writes a position to each. Only `position` is sent,
 * so a reorder cannot carry stale project content with it — the bug this table was
 * created to prevent would otherwise walk straight back in through the reorder path.
 */
export async function reorderProjects(slugs: string[]): Promise<void> {
  const supabase = createAdminClient();

  for (const [index, slug] of slugs.entries()) {
    const { error } = await supabase
      .from("projects")
      .update({ position: index })
      .eq("slug", slug);
    if (error) throw error;
  }
}

/**
 * The projects array as `getAllConfig` needs it.
 *
 * Lets the error through. An empty array would render a portfolio with no work in it and
 * look entirely deliberate — the failure mode worth avoiding is not an error page, it is
 * a convincing wrong one.
 */
export async function projectsForSite(): Promise<Project[]> {
  const rows = await listProjects({ activeOnly: true });
  return rows.map((row) => row.data);
}

/** Newest `updated_at` across projects, for the sitemap's lastmod. */
export async function projectsLastModified(): Promise<Date | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("updated_at")
    .is("archived_at", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ updated_at: string }>();

  if (error || !data) return null;
  return new Date(data.updated_at);
}
