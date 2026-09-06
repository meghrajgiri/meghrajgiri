import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { revalidateSite } from "@/lib/revalidate-site";
import { getProject, setProjectArchived, updateProject } from "@/lib/projects";

/**
 * One project.
 *
 * A save here writes a single row and reads nothing else, so it cannot carry a stale
 * copy of any other project with it. That is the entire reason this route exists.
 *
 * There is no DELETE. Removal is archiving — PATCH below — which takes a project off the
 * site and leaves the row, its case study and its images untouched. A project that is no
 * longer work you want shown does not need to be destroyed to stop being shown, and the
 * cost of the two mistakes is not symmetrical: an archived project is one click from
 * coming back, and a deleted one is gone.
 */

type Params = { params: Promise<{ slug: string }> };

// GET /api/projects/thriftverse
export async function GET(request: NextRequest, { params }: Params) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const row = await getProject(slug);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ project: row });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// PUT /api/projects/thriftverse — replace this project's content.
export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const project = body?.project;

  if (!project || typeof project !== "object") {
    return NextResponse.json({ error: "Invalid project" }, { status: 400 });
  }

  const nextSlug = typeof project.slug === "string" ? project.slug.trim() : "";
  if (!nextSlug) {
    return NextResponse.json(
      { error: "A slug is required, and it becomes the project's URL" },
      { status: 400 },
    );
  }

  if (nextSlug !== slug) {
    // A published project's slug is a live URL: in the sitemap, indexed, possibly linked
    // to from outside. Renaming it does not redirect anything — it retires one URL and
    // creates another. The form disables the field, but a disabled input is a courtesy
    // and not a rule, so the rule lives here.
    //
    // Judged on where the save leaves the project, not only on where it started:
    // unpublishing and renaming in one save is coherent, because that URL is being
    // retired either way. Only a rename that leaves it published is refused.
    const current = await getProject(slug);
    if (current?.published && project.published !== false) {
      return NextResponse.json(
        {
          error:
            "This project is published, so its URL is locked. Unpublish it first to change the slug.",
        },
        { status: 409 },
      );
    }

    // And it must not land on another project.
    if (await getProject(nextSlug)) {
      return NextResponse.json(
        { error: `A project with the slug "${nextSlug}" already exists` },
        { status: 409 },
      );
    }
  }

  try {
    const row = await updateProject(slug, { ...project, slug: nextSlug });
    if (!row) {
      // The row is gone — archived is still findable, so this means genuinely removed.
      // Saying so is the whole point: the previous editor would have reported success
      // and written nothing.
      return NextResponse.json(
        { error: "This project no longer exists" },
        { status: 404 },
      );
    }

    revalidateSite(slug);
    if (nextSlug !== slug) revalidateSite(nextSlug);
    return NextResponse.json({ project: row });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/thriftverse — archive or restore.
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (typeof body?.archived !== "boolean") {
    return NextResponse.json(
      { error: "Expected { archived: boolean }" },
      { status: 400 },
    );
  }

  try {
    const row = await setProjectArchived(slug, body.archived);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Archiving removes /projects/<slug> from the site and the sitemap; restoring puts
    // it back. Both need the same flush, and the project page itself needs one so the
    // prerendered copy does not outlive the change.
    revalidateSite(slug);
    return NextResponse.json({ project: row });
  } catch (error) {
    console.error("Error archiving project:", error);
    return NextResponse.json(
      { error: `Failed to ${body.archived ? "archive" : "restore"} project` },
      { status: 500 },
    );
  }
}
