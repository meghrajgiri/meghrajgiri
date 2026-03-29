#!/usr/bin/env node

import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";

const MIGRATIONS_DIR = resolve(import.meta.dirname, "migrations");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.env.SUPABASE_DATABASE_PASSWORD;

if (!url) {
  console.error("\x1b[31mMissing NEXT_PUBLIC_SUPABASE_URL in .env\x1b[0m");
  process.exit(1);
}

const ref = url.replace("https://", "").replace(".supabase.co", "");
const dbUrl = `postgresql://postgres:${dbPassword}@db.${ref}.supabase.co:5432/postgres?sslmode=require`;

function tryPsql(filePath) {
  try {
    execSync(`psql "${dbUrl}" -f "${filePath}" 2>&1`, { stdio: "pipe" });
    return { ok: true };
  } catch (err) {
    const output = err.stdout?.toString() || err.stderr?.toString() || "";
    if (output.includes("already exists")) {
      return { ok: true, skipped: true };
    }
    return { ok: false, error: output.trim() };
  }
}

function run() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const target = process.argv[2];
  const toRun = target ? files.filter((f) => f.includes(target)) : files;

  if (toRun.length === 0) {
    console.log("No migrations found.");
    return;
  }

  console.log(`\n\x1b[1m\x1b[35m=== Supabase Migrations ===\x1b[0m\n`);

  // Try psql first
  if (dbPassword) {
    const result = tryPsql(join(MIGRATIONS_DIR, toRun[0]));
    if (result.ok) {
      // psql works, run all migrations through it
      for (const file of toRun) {
        process.stdout.write(`  \x1b[36m${file}\x1b[0m ... `);
        const r = tryPsql(join(MIGRATIONS_DIR, file));
        if (r.ok) {
          console.log(r.skipped ? "\x1b[32m✓ (already applied)\x1b[0m" : "\x1b[32m✓\x1b[0m");
        } else {
          console.log(`\x1b[31m✗\x1b[0m\n    ${r.error}`);
        }
      }
      console.log("\n\x1b[32mDone.\x1b[0m\n");
      return;
    }
  }

  // psql not available — output SQL for manual execution
  console.log("  \x1b[33mCannot connect via psql. Outputting SQL to run manually.\x1b[0m\n");
  console.log("  Copy everything below and paste into Supabase SQL Editor:\n");
  console.log("\x1b[90m  ─────────────────────────────────────────\x1b[0m\n");

  for (const file of toRun) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    console.log(`  \x1b[36m-- ${file}\x1b[0m`);
    console.log(sql);
  }

  console.log("\x1b[90m  ─────────────────────────────────────────\x1b[0m\n");
}

run();
