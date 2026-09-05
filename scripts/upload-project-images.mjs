#!/usr/bin/env node

/**
 * Move project images from `public/projects/` into Supabase Storage and repoint the
 * CMS at them.
 *
 * Idempotent: uploads use upsert, and rewriting a config that already holds storage
 * URLs is a no-op. Safe to re-run after adding images to `public/projects/`.
 *
 *   yarn images:upload            # upload and repoint
 *   yarn images:upload --dry-run  # report what would change, touch nothing
 *
 * Dimensions are captured here rather than at render time. `getImageSizes` reads them
 * from the filesystem, which stops working the moment the images live on a remote
 * host — and without real width/height `next/image` cannot reserve space, so the page
 * shifts as each screenshot loads. Recording them in the config keeps the layout
 * stable with no build-time network calls.
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { extname, join, resolve } from "path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE_DIR = join(ROOT, "public", "projects");
const BUCKET = "project-images";
const DRY_RUN = process.argv.includes("--dry-run");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "\x1b[31mMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env\x1b[0m",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

/** Public URL for an object. Matches what the bucket serves for anonymous reads. */
function publicUrl(objectPath) {
  return supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

/** Every image under public/projects, keyed by the `/projects/...` path config uses. */
function collectLocalImages() {
  const out = [];
  // Absent once the migration has run and public/projects has been removed. Not an
  // error: the script's other half — repointing config — is still a valid no-op, and
  // failing here would make a re-run look broken.
  if (!existsSync(SOURCE_DIR)) return out;

  for (const slug of readdirSync(SOURCE_DIR)) {
    const dir = join(SOURCE_DIR, slug);
    if (!statSync(dir).isDirectory()) continue;

    for (const file of readdirSync(dir)) {
      const ext = extname(file).toLowerCase();
      if (!CONTENT_TYPES[ext]) continue;
      out.push({
        // The object path keeps the original extension case-normalised: several
        // screenshots are `.PNG`, and a bucket path is case-sensitive where the
        // filesystem here is not.
        objectPath: `${slug}/${file.replace(/\.[^.]+$/, ext)}`,
        localPath: join(dir, file),
        configPath: `/projects/${slug}/${file}`,
        contentType: CONTENT_TYPES[ext],
      });
    }
  }
  return out.sort((a, b) => a.objectPath.localeCompare(b.objectPath));
}

async function main() {
  const images = collectLocalImages();
  console.log(
    `\n\x1b[1m\x1b[35m=== Project images -> Supabase Storage ===\x1b[0m\n`,
  );
  console.log(`  ${images.length} image(s) under public/projects`);
  if (DRY_RUN) console.log("  \x1b[33mdry run — nothing will be written\x1b[0m");
  console.log();

  /** configPath -> { url, width, height } */
  const mapping = {};
  let uploaded = 0;
  let failed = 0;

  for (const img of images) {
    const bytes = readFileSync(img.localPath);
    let size = {};
    try {
      const meta = await sharp(bytes).metadata();
      if (meta.width && meta.height) size = { width: meta.width, height: meta.height };
    } catch {
      // An unreadable header is not fatal — the component falls back to a plain
      // <img>. Worth reporting, not worth stopping the run.
      console.log(`  \x1b[33m? ${img.objectPath} — could not read dimensions\x1b[0m`);
    }

    if (!DRY_RUN) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(img.objectPath, bytes, {
          contentType: img.contentType,
          upsert: true,
          cacheControl: "31536000",
        });

      if (error) {
        console.log(`  \x1b[31m✗ ${img.objectPath} — ${error.message}\x1b[0m`);
        failed++;
        continue;
      }
    }

    mapping[img.configPath] = { url: publicUrl(img.objectPath), ...size };
    uploaded++;
    process.stdout.write(`\r  uploaded ${uploaded}/${images.length}`);
  }

  console.log(`\n`);
  if (failed > 0) {
    console.error(`  \x1b[31m${failed} upload(s) failed — config not rewritten\x1b[0m`);
    process.exit(1);
  }

  await repointConfig(mapping);
}

/**
 * Rewrite the `projects` config so `image` and `screenshots` name storage URLs, and
 * record each one's dimensions.
 *
 * Paths that are already absolute URLs are left alone, so a project whose images were
 * uploaded through the CMS is not disturbed by a re-run.
 */
async function repointConfig(mapping) {
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "projects")
    .single();

  if (error) {
    console.error(`  \x1b[31mFailed to read projects config: ${error.message}\x1b[0m`);
    process.exit(1);
  }

  const config = data.value;
  let rewritten = 0;
  let unmatched = 0;

  const resolveOne = (src, sizes) => {
    if (!src || src.startsWith("http")) return src;
    const hit = mapping[src];
    if (!hit) {
      console.log(`  \x1b[33m? no upload found for ${src} — left as-is\x1b[0m`);
      unmatched++;
      return src;
    }
    if (hit.width && hit.height) {
      sizes[hit.url] = { width: hit.width, height: hit.height };
    }
    rewritten++;
    return hit.url;
  };

  for (const project of config.projects ?? []) {
    const sizes = { ...(project.imageSizes ?? {}) };
    project.image = resolveOne(project.image, sizes);
    if (Array.isArray(project.screenshots)) {
      project.screenshots = project.screenshots.map((s) => resolveOne(s, sizes));
    }
    if (Object.keys(sizes).length > 0) project.imageSizes = sizes;
  }

  console.log(`  ${rewritten} path(s) repointed at storage`);
  if (unmatched > 0) console.log(`  \x1b[33m${unmatched} path(s) had no matching upload\x1b[0m`);

  if (DRY_RUN) {
    console.log("\n  \x1b[33mdry run — config not written\x1b[0m\n");
    return;
  }

  const { error: writeError } = await supabase
    .from("site_config")
    .update({ value: config })
    .eq("key", "projects");

  if (writeError) {
    console.error(`  \x1b[31mFailed to write config: ${writeError.message}\x1b[0m`);
    process.exit(1);
  }

  console.log(
    `\n  \x1b[32mDone.\x1b[0m Run \x1b[36myarn config:snapshot\x1b[0m to update the committed fallback.\n`,
  );
}

main();
