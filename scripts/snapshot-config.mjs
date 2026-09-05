#!/usr/bin/env node

/**
 * Dump the live `site_config` table to a committed JSON snapshot.
 *
 * The snapshot is what the site renders from when Supabase is unreachable. Without
 * it `getAllConfig` returns `{}` and every unguarded `config.metadata.author`-style
 * read throws, taking the whole public site down with a 500 rather than serving
 * slightly stale content.
 *
 * Run after any meaningful content edit in /admin, and commit the result:
 *   yarn config:snapshot
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const OUT = resolve(import.meta.dirname, "..", "src", "config", "fallback.json");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("\x1b[31mMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\x1b[0m");
  process.exit(1);
}

/**
 * Only the sections the site actually renders. Shared with `getAllConfig` and the
 * `/api/config` allowlist via `src/config/sections.json`, so a new section cannot be
 * added to the site and forgotten here — which would leave the committed fallback
 * silently missing it.
 */
const SECTIONS = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../src/config/sections.json"), "utf-8"),
);
const KEYS = SECTIONS.rendered;

// A section the CMS can save but the site never reads would accept edits that quietly
// go nowhere. Cheap to check here, where the lists are already loaded.
const orphaned = SECTIONS.editable.filter((key) => !KEYS.includes(key));
if (orphaned.length > 0) {
  console.error(
    `\x1b[31msections.json: ${orphaned.join(", ")} listed as editable but not rendered\x1b[0m`,
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const { data, error } = await supabase
  .from("site_config")
  .select("key, value")
  .in("key", KEYS);

if (error) {
  console.error(`\x1b[31mFailed to read site_config:\x1b[0m ${error.message}`);
  process.exit(1);
}

const missing = KEYS.filter((k) => !data.some((r) => r.key === k));
if (missing.length) {
  console.error(`\x1b[31mRefusing to write a partial snapshot. Missing:\x1b[0m ${missing.join(", ")}`);
  process.exit(1);
}

// Stable key order keeps the committed diff readable when one section changes.
const snapshot = Object.fromEntries(
  KEYS.map((k) => [k, data.find((r) => r.key === k).value]),
);

writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`\x1b[32m✓\x1b[0m Snapshot written: ${KEYS.length} sections → src/config/fallback.json`);
