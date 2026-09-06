import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

/**
 * Verify a CMS request carries a valid Supabase session.
 *
 * Lives here rather than in a route because there is now more than one write surface —
 * `/api/config` and `/api/projects` — and an auth check copied into a second file is a
 * check that will eventually be improved in only one of them.
 *
 * The anon key is correct here: `getUser` validates the caller's token, and doing that
 * with the service role would authenticate every request as an administrator.
 */
export async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(authHeader.slice(7));

  return !error && !!user;
}
