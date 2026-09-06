"use client";

import {
  ConfigEditor,
  SectionLabel,
  TextAreaField,
  TextField,
  ArrayField,
} from "@/components/admin/ConfigEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useState } from "react";

/**
 * Article editor.
 *
 * Bodies are written in a rich-text editor and stored as Markdown — see
 * `RichTextEditor` for why the storage format is not HTML. Posts are collapsed by
 * default: mounting three TipTap instances at once to edit one of them is wasteful,
 * and a page of expanded editors is hard to navigate.
 */

type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  published: string;
  updated?: string;
  keywords: string[];
  excerpt: string;
  body: string;
  draft?: boolean;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Built per click rather than once at module scope: a module-level `new Date()` in a
 * client component is evaluated on the server and again in the browser, which is the
 * classic source of a hydration mismatch. Nothing renders `BLANK` today, so it is not
 * a live bug — but it is not worth leaving as a trap either.
 */
function blankPost(): Post {
  return {
    slug: "",
    title: "",
    metaTitle: "",
    description: "",
    published: today(),
    keywords: [],
    excerpt: "",
    body: "",
    draft: true,
  };
}

export default function BlogConfigPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ConfigEditor
      configKey="blog"
      title="Articles"
      description="Write and edit articles. Bodies are stored as Markdown."
    >
      {({ config, updateField }) => {
        const posts = (config.posts as Post[]) ?? [];

        const setPost = (i: number, patch: Partial<Post>) => {
          const next = [...posts];
          next[i] = { ...next[i], ...patch };
          updateField("posts", next);
        };

        return (
          <div className="space-y-4">
            {posts.map((post, i) => {
              const expanded = open === i;
              return (
                <div key={i} className="rounded-[6px] border border-border">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? null : i)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <span className="text-faint">{expanded ? "▾" : "▸"}</span>
                      <span className="text-sm font-medium text-foreground">
                        {post.title || "Untitled article"}
                      </span>
                      {post.draft && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-500">
                          Draft
                        </span>
                      )}
                    </button>
                    <span className="font-mono text-xs text-faint">
                      {post.published}
                    </span>
                  </div>

                  {expanded && (
                    <div className="space-y-4 border-t border-border p-4">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={post.draft ?? false}
                          onChange={(e) =>
                            setPost(i, { draft: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-border"
                        />
                        Draft — hidden from the site, the sitemap and search
                        engines
                      </label>

                      <TextField
                        label="Slug (URL: /blog/…)"
                        value={post.slug}
                        onChange={(v) => setPost(i, { slug: v })}
                      />
                      <p className="-mt-3 text-xs text-amber-600 dark:text-amber-500">
                        Changing the slug changes the URL and the old one will
                        404.
                      </p>

                      <TextField
                        label="Title (H1 and article listing)"
                        value={post.title}
                        onChange={(v) => setPost(i, { title: v })}
                      />
                      <TextField
                        label="Title tag (what Google shows — carries the keyword)"
                        value={post.metaTitle}
                        onChange={(v) => setPost(i, { metaTitle: v })}
                      />
                      <TextAreaField
                        label="Meta description"
                        value={post.description}
                        onChange={(v) => setPost(i, { description: v })}
                      />
                      <TextAreaField
                        label="Excerpt (shown on /blog)"
                        value={post.excerpt}
                        onChange={(v) => setPost(i, { excerpt: v })}
                      />

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <TextField
                            label="Published (YYYY-MM-DD)"
                            value={post.published}
                            onChange={(v) => setPost(i, { published: v })}
                          />
                        </div>
                        <div className="flex-1">
                          <TextField
                            label="Updated (optional)"
                            value={post.updated ?? ""}
                            onChange={(v) => setPost(i, { updated: v })}
                          />
                        </div>
                      </div>

                      <ArrayField
                        label="Keywords"
                        value={post.keywords ?? []}
                        onChange={(v) => setPost(i, { keywords: v })}
                      />

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-muted-foreground">
                          Body
                        </label>
                        <RichTextEditor
                          value={post.body}
                          onChange={(md) => setPost(i, { body: md })}
                          minHeight={420}
                        />
                        <p className="text-xs text-muted-foreground">
                          Internal links like <code>/about</code> or{""}
                          <code>/projects</code> keep readers on the site and
                          help search engines connect the pages.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updateField(
                            "posts",
                            posts.filter((_, j) => j !== i),
                          );
                          setOpen(null);
                        }}
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Delete article
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            <SectionLabel>New</SectionLabel>
            <button
              type="button"
              onClick={() => {
                updateField("posts", [blankPost(), ...posts]);
                setOpen(0);
              }}
              className="w-full rounded-[6px] border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-border-strong"
            >
              + New article (starts as a draft)
            </button>
          </div>
        );
      }}
    </ConfigEditor>
  );
}
