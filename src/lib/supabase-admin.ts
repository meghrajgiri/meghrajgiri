import { createClient } from "@supabase/supabase-js";

// Server-side client with service role key - use only in API routes/server components
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, cache: "no-store" }),
      },
    },
  );
}
