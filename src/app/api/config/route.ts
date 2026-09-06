import { NextRequest, NextResponse } from "next/server";
import sections from "@/config/sections.json";
import { verifyAdmin } from "@/lib/admin-auth";
import { revalidateSite } from "@/lib/revalidate-site";
import { getConfig, saveConfig } from "@/lib/config";

/**
 * Shared with `getAllConfig` — see `src/config/sections.json`.
 * This list used to be maintained here by hand, which meant a new section could ship
 * with a working page and a CMS editor that failed with "Invalid config key".
 */
const VALID_KEYS = sections.editable;

// GET /api/config?key=personal
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");

  if (!key || !VALID_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid config key" }, { status: 400 });
  }

  try {
    return NextResponse.json({ key, value: await getConfig(key) });
  } catch (error) {
    // `getConfig` throws on a failed read rather than returning an empty object, so the
    // editor reports an error instead of rendering a blank form that its next Save would
    // write over the top of the real content.
    console.error(`Error reading config "${key}":`, error);
    return NextResponse.json(
      { error: `Could not read "${key}" from Supabase` },
      { status: 500 },
    );
  }
}

// PUT /api/config
export async function PUT(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { key, value } = body;

  if (!key || !VALID_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid config key" }, { status: 400 });
  }

  if (!value || typeof value !== "object") {
    return NextResponse.json({ error: "Invalid config value" }, { status: 400 });
  }

  // Projects are rows in their own table and are written one at a time through
  // `/api/projects`. Accepting an array here would restore exactly the failure that
  // splitting them up removed: a whole-collection write built from whatever the
  // editing tab happened to be holding.
  if (key === "projects" && "projects" in value) {
    return NextResponse.json(
      {
        error:
          "Projects are edited individually — use /api/projects. This endpoint saves the section's heading and call to action only.",
      },
      { status: 400 },
    );
  }

  try {
    await saveConfig(key, value);
    revalidateSite();
    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 },
    );
  }
}
