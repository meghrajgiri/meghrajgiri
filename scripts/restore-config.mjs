#!/usr/bin/env node

/**
 * Restore the committed snapshot back into Supabase.
 *
 * The inverse of `yarn config:snapshot`. This replaces the old `seed-config.mjs`, which
 * parsed `src/config/*.ts` with `new Function()` — those files were deleted when the
 * admin panel landed, so the script had been broken and unrunnable since.
 *
 * Use it when the live config is lost or corrupted: a bad admin edit, a dropped row, a
 * restored-from-blank project. `src/config/fallback.json` is committed, so git history
 * gives you every previous state to restore from.
 *
 *   node --env-file=.env scripts/restore-config.mjs           # dry run
 *   node --env-file=.env scripts/restore-config.mjs --write   # apply
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const SNAPSHOT = resolve(import.meta.dirname, "..", "src", "config", "fallback.json");
const WRITE = process.argv.includes("--write");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("\x1b[31mMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\x1b[0m");
  process.exit(1);
}

const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf-8"));
const supabase = createClient(url, key);

const { data: live, error } = await supabase.from("site_config").select("key, value");
if (error) {
  console.error(`\x1b[31mCould not read site_config:\x1b[0m ${error.message}`);
  process.exit(1);
}
const liveByKey = Object.fromEntries(live.map((r) => [r.key, r.value]));

console.log(`\n\x1b[1m${WRITE ? "Restoring" : "Dry run"} — snapshot vs live\x1b[0m\n`);

const changed = [];
for (const [k, value] of Object.entries(snapshot)) {
  const same = JSON.stringify(liveByKey[k]) === JSON.stringify(value);
  const state = !(k in liveByKey) ? "\x1b[31mMISSING in live\x1b[0m" : same ? "\x1b[32midentical\x1b[0m" : "\x1b[33mDIFFERS\x1b[0m";
  console.log(`  ${k.padEnd(12)} ${state}`);
  if (!same) changed.push(k);
}

// Rows that exist only in the database. The snapshot deliberately covers just the ten
// sections the site renders, so anything else here is content the site does not use
// yet — never delete it as part of a restore.
const extra = live.map((r) => r.key).filter((k) => !(k in snapshot));
if (extra.length) {
  console.log(`\n\x1b[90m  Live-only rows, left untouched: ${extra.join(", ")}\x1b[0m`);
}

if (!changed.length) {
  console.log("\n\x1b[32mLive config already matches the snapshot. Nothing to do.\x1b[0m\n");
  process.exit(0);
}

if (!WRITE) {
  console.log(`\n\x1b[33m${changed.length} section(s) would be overwritten: ${changed.join(", ")}\x1b[0m`);
  console.log("\x1b[33mRe-run with --write to apply.\x1b[0m\n");
  process.exit(0);
}

const rows = changed.map((k) => ({ key: k, value: snapshot[k], updated_at: new Date().toISOString() }));
const { error: upErr } = await supabase.from("site_config").upsert(rows, { onConflict: "key" });
if (upErr) {
  console.error(`\x1b[31mRestore failed:\x1b[0m ${upErr.message}`);
  process.exit(1);
}
console.log(`\n\x1b[32m✓ Restored ${rows.length} section(s).\x1b[0m Redeploy or edit in /admin to revalidate.\n`);
