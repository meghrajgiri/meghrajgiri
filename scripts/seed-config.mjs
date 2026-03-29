#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const CONFIG_DIR = resolve(ROOT, "src", "config");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("\x1b[31mMissing env vars.\x1b[0m");
  process.exit(1);
}

const supabase = createClient(url, key);

// Parse the exported object from a TS config file
function parseConfig(filename) {
  const content = readFileSync(resolve(CONFIG_DIR, filename), "utf-8");
  // Remove export and type annotations, extract the object
  const cleaned = content
    .replace(/export\s+const\s+\w+\s*=\s*/, "return ")
    .replace(/\]\s*as\s+const\s*;/, "];")
    .replace(/;\s*$/, "");
  try {
    return new Function(cleaned)();
  } catch {
    // Fallback: try removing trailing 'as const'
    const cleaned2 = cleaned.replace(/as\s+const/, "");
    return new Function(cleaned2)();
  }
}

const configs = [
  { key: "personal", file: "personal.ts" },
  { key: "hero", file: "hero.ts" },
  { key: "about", file: "about.ts" },
  { key: "skills", file: "skills.ts" },
  { key: "projects", file: "projects.ts" },
  { key: "contact", file: "contact.ts" },
  { key: "education", file: "education.ts" },
  { key: "experience", file: "experience.ts" },
  { key: "metadata", file: "metadata.ts" },
  { key: "navigation", file: "navigation.ts" },
];

async function seed() {
  console.log("\n\x1b[1m\x1b[35m=== Seeding site_config ===\x1b[0m\n");

  for (const { key, file } of configs) {
    process.stdout.write(`  \x1b[36m${key}\x1b[0m (${file}) ... `);

    try {
      const value = parseConfig(file);

      const { error } = await supabase
        .from("site_config")
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: "key" },
        );

      if (error) {
        console.log(`\x1b[31m✗\x1b[0m ${error.message}`);
      } else {
        console.log("\x1b[32m✓\x1b[0m");
      }
    } catch (err) {
      console.log(`\x1b[31m✗ Parse error\x1b[0m ${err.message}`);
    }
  }

  console.log("\n\x1b[32mDone.\x1b[0m\n");
}

seed();
