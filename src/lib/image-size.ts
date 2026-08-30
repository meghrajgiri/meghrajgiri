import { readFile } from "fs/promises";
import path from "path";

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Read the intrinsic pixel dimensions of an image in `public/` straight from its
 * header bytes.
 *
 * `next/image` needs real `width`/`height` to reserve the right space, and the
 * project thumbnails here range from 1.73:1 to 2.15:1 — so a single hardcoded aspect
 * would either crop some images or shift the layout as each one loads. The paths come
 * from the database at runtime, which rules out static imports.
 *
 * Header parsing rather than a dependency: this needs three formats and about forty
 * lines, and it runs at build time on the server only.
 */
async function parse(buf: Buffer): Promise<ImageSize | null> {
  // PNG — IHDR is always the first chunk, at a fixed offset.
  if (buf.length >= 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG — walk the marker segments to the first Start Of Frame.
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length - 9) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      // SOF0-SOF15, excluding the non-frame markers DHT (c4), JPG (c8) and DAC (cc).
      const isSOF =
        marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSOF) {
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buf.readUInt16BE(offset + 2);
    }
    return null;
  }

  // WebP — three sub-formats, each storing the size differently.
  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const format = buf.toString("ascii", 12, 16);

    if (format === "VP8 ") {
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
      };
    }
    if (format === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }
    if (format === "VP8X") {
      const w = buf[24] | (buf[25] << 8) | (buf[26] << 16);
      const h = buf[27] | (buf[28] << 8) | (buf[29] << 16);
      return { width: w + 1, height: h + 1 };
    }
  }

  return null;
}

/**
 * Resolve sizes for a set of `/`-rooted public paths.
 *
 * Anything unreadable or in an unrecognised format is simply omitted — the caller
 * falls back to a plain `<img>` for that one rather than guessing an aspect ratio.
 */
export async function getImageSizes(
  srcs: (string | undefined)[],
): Promise<Record<string, ImageSize>> {
  const unique = [...new Set(srcs.filter((s): s is string => !!s && s.startsWith("/")))];

  const entries = await Promise.all(
    unique.map(async (src) => {
      try {
        // Read only the head of the file; every format above declares its dimensions
        // within the first few KB, and some of these images are over a megabyte.
        const buf = await readFile(path.join(process.cwd(), "public", src));
        const size = await parse(buf.subarray(0, 65536));
        return size ? ([src, size] as const) : null;
      } catch {
        return null;
      }
    }),
  );

  return Object.fromEntries(entries.filter((e): e is NonNullable<typeof e> => !!e));
}
