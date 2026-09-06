import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { revalidateSite } from "@/lib/revalidate-site";
import { createProject, listProjects, reorderProjects } from "@/lib/projects";
import { PLACEHOLDER_SLUG, uniqueSlug } from "@/lib/slug";

/**
 * The project collection.
 *
 * GET lists, POST adds one, PATCH reorders. Each is its own operation on its own rows —
 * the point of the whole change. Editing a single project lives at
 * `/api/projects/[slug]`.
 */

// GET /api/projects — every project, drafts included, in display order.
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ projects: await listProjects() });
  } catch (error) {
    console.error("Error listing projects:", error);
    return NextResponse.json(
      { error: "Failed to list projects" },
      { status: 500 },
    );
  }
}

// POST /api/projects — add one.
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const project = body?.project;

  if (!project || typeof project !== "object") {
    return NextResponse.json({ error: "Invalid project" }, { status: 400 });
  }

  // A row needs a unique key the moment it exists, but the name arrives later — on the
  // project's own page. So a project with no slug is created under a placeholder, and
  // the form mirrors the title into the slug from there.
  const taken = new Set((await listProjects()).map((row) => row.slug));
  const requested =
    typeof project.slug === "string" && project.slug.trim()
      ? project.slug.trim()
      : PLACEHOLDER_SLUG;

  if (requested !== PLACEHOLDER_SLUG && taken.has(requested)) {
    // A slug asked for by name is a decision, so a collision is reported rather than
    // silently suffixed. Only the placeholder counts up on its own.
    return NextResponse.json(
      { error: `A project with the slug "${requested}" already exists` },
      { status: 409 },
    );
  }

  const slug = uniqueSlug(requested, taken);

  try {
    const row = await createProject({ ...project, slug });
    revalidateSite(slug);
    return NextResponse.json({ project: row }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

// PATCH /api/projects — reorder, by a full ordered list of slugs.
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const slugs: unknown = body?.slugs;

  if (!Array.isArray(slugs) || slugs.some((s) => typeof s !== "string")) {
    return NextResponse.json(
      { error: "Expected { slugs: string[] }" },
      { status: 400 },
    );
  }

  // A partial list would leave the projects it omits holding positions that now collide
  // with the ones it sets, so the order would be decided by whatever the database
  // happened to return. Reordering is all-or-nothing.
  const existing = (await listProjects()).map((row) => row.slug);
  const sent = new Set(slugs as string[]);
  if (sent.size !== slugs.length || existing.some((slug) => !sent.has(slug))) {
    return NextResponse.json(
      { error: "The list must contain every project exactly once" },
      { status: 400 },
    );
  }

  try {
    await reorderProjects(slugs as string[]);
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering projects:", error);
    return NextResponse.json(
      { error: "Failed to reorder projects" },
      { status: 500 },
    );
  }
}
