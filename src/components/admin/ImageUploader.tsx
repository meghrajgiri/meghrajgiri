"use client";

import { supabase } from "@/lib/supabase";
import { useRef, useState } from "react";

export type UploadedImage = {
  url: string;
  width?: number;
  height?: number;
};

const BUCKET = "project-images";

/** Mirrors the bucket's `allowed_mime_types` so a rejection is explained here first. */
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Read intrinsic dimensions in the browser, before upload.
 *
 * These are stored alongside the URL because `next/image` needs real width and height
 * to reserve space — without them every screenshot shifts the page as it loads. The
 * server cannot cheaply derive them from a remote URL, and the browser already holds
 * the bytes, so this is the one place where it is free.
 */
function readDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Make a filename safe for an object path.
 *
 * Storage paths are case-sensitive and do not tolerate spaces the way the local
 * filesystem does — several of the original screenshots were `.PNG` with spaces, and
 * those became unreachable URLs when copied verbatim.
 */
function objectName(file: File) {
  const dot = file.name.lastIndexOf(".");
  const stem = (dot === -1 ? file.name : file.name.slice(0, dot))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
  const ext = (dot === -1 ? "" : file.name.slice(dot)).toLowerCase();
  // A short suffix keeps a re-upload of the same filename from silently replacing an
  // image another project still points at.
  return `${stem}-${Date.now().toString(36)}${ext}`;
}

export function ImageUploader({
  folder,
  multiple = false,
  label = "Upload image",
  onUploaded,
}: {
  /** Object path prefix, normally the project slug. */
  folder: string;
  multiple?: boolean;
  label?: string;
  onUploaded: (images: UploadedImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setError(null);
    setBusy(true);
    const done: UploadedImage[] = [];

    try {
      for (const [i, file] of list.entries()) {
        if (!ACCEPTED.includes(file.type)) {
          throw new Error(`${file.name}: ${file.type || "unknown type"} is not an image`);
        }
        if (file.size > MAX_BYTES) {
          throw new Error(
            `${file.name}: ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds the 10MB limit`,
          );
        }

        setProgress(`Uploading ${i + 1} of ${list.length}…`);
        const size = await readDimensions(file);
        const path = `${folder || "misc"}/${objectName(file)}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type,
            cacheControl: "31536000",
            upsert: false,
          });

        if (uploadError) throw new Error(`${file.name}: ${uploadError.message}`);

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        done.push({ url: data.publicUrl, ...(size ?? {}) });
      }

      onUploaded(done);
      setProgress(`Uploaded ${done.length} image${done.length === 1 ? "" : "s"}`);
      setTimeout(() => setProgress(null), 2500);
    } catch (e) {
      // Partial success is reported rather than silently discarded — the images that
      // did upload are already in the bucket, and pretending otherwise would leave
      // orphans nobody knows about.
      if (done.length > 0) onUploaded(done);
      setError(e instanceof Error ? e.message : "Upload failed");
      setProgress(null);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!busy) upload(e.dataTransfer.files);
        }}
        className={`rounded-lg border border-dashed px-4 py-6 text-center transition-colors ${
          dragging
            ? "border-gray-900 bg-gray-50 dark:border-gray-100 dark:bg-gray-900"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {busy ? "Uploading…" : label}
        </button>
        <p className="mt-2 text-xs text-gray-500">
          or drop {multiple ? "images" : "an image"} here · PNG, JPEG, WebP, AVIF or
          GIF · up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple={multiple}
          hidden
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {progress && <p className="text-xs text-gray-500">{progress}</p>}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
