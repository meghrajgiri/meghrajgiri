import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/config";

const VALID_KEYS = [
  "personal",
  "hero",
  "about",
  "skills",
  "projects",
  "contact",
  "education",
  "experience",
  "metadata",
  "navigation",
];

// Verify the request has a valid Supabase auth session
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  return !error && !!user;
}

// GET /api/config?key=personal
export async function GET(request: NextRequest) {
  const isAuthed = await verifyAuth(request);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");

  if (!key || !VALID_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid config key" }, { status: 400 });
  }

  const value = await getConfig(key);
  return NextResponse.json({ key, value });
}

// PUT /api/config
export async function PUT(request: NextRequest) {
  const isAuthed = await verifyAuth(request);
  if (!isAuthed) {
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

  try {
    await saveConfig(key, value);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 },
    );
  }
}
