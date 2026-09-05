"use client";

import {
  ConfigEditor,
  SectionLabel,
  TextAreaField,
  TextField,
  ArrayField,
} from "@/components/admin/ConfigEditor";

/**
 * Stack-specific hire pages and the questions on the hub.
 *
 * A page's `slug` is its URL, so changing it retires the old address — there is no
 * redirect behind it. The warning under the field is the only guard; adding real
 * redirect handling would mean storing a history of former slugs, which is more
 * machinery than two pages justify today.
 */

type Evidence = { slug: string; name: string; note: string };
type QA = { q: string; a: string };
type HirePage = {
  slug: string;
  stack: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  evidence: Evidence[];
  qa: QA[];
};

const BLANK: HirePage = {
  slug: "",
  stack: "",
  title: "",
  description: "",
  h1: "",
  intro: "",
  keywords: [],
  evidence: [],
  qa: [],
};

export default function HireConfigPage() {
  return (
    <ConfigEditor
      configKey="hire"
      title="Hire pages"
      description="Stack-specific hire pages and the hub's questions"
    >
      {({ config, updateField }) => {
        const pages = (config.pages as HirePage[]) ?? [];
        const hubQa = (config.qa as QA[]) ?? [];

        const setPage = (i: number, patch: Partial<HirePage>) => {
          const next = [...pages];
          next[i] = { ...next[i], ...patch };
          updateField("pages", next);
        };

        return (
          <div className="space-y-6">
            <SectionLabel>Hub questions (/hire)</SectionLabel>
            {hubQa.map((item, i) => (
              <div
                key={i}
                className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
              >
                <TextField
                  label="Question"
                  value={item.q}
                  onChange={(v) => {
                    const next = [...hubQa];
                    next[i] = { ...next[i], q: v };
                    updateField("qa", next);
                  }}
                />
                <TextAreaField
                  label="Answer"
                  rows={4}
                  value={item.a}
                  onChange={(v) => {
                    const next = [...hubQa];
                    next[i] = { ...next[i], a: v };
                    updateField("qa", next);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "qa",
                      hubQa.filter((_, j) => j !== i),
                    )
                  }
                  className="text-xs text-red-600 hover:underline dark:text-red-400"
                >
                  Remove question
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateField("qa", [...hubQa, { q: "", a: "" }])}
              className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400"
            >
              + Add question
            </button>

            {pages.map((page, i) => (
              <div key={i} className="space-y-4">
                <SectionLabel>{page.stack || `Page ${i + 1}`}</SectionLabel>
                <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <TextField
                    label="Slug (URL: /hire/…)"
                    value={page.slug}
                    onChange={(v) => setPage(i, { slug: v })}
                  />
                  <p className="-mt-3 text-xs text-amber-600 dark:text-amber-500">
                    Changing the slug changes the URL. The old address will 404 — only
                    change it if the page has no traffic or links yet.
                  </p>
                  <TextField
                    label="Stack name (badge and headings)"
                    value={page.stack}
                    onChange={(v) => setPage(i, { stack: v })}
                  />
                  <TextField
                    label="Title tag"
                    value={page.title}
                    onChange={(v) => setPage(i, { title: v })}
                  />
                  <TextAreaField
                    label="Meta description"
                    value={page.description}
                    onChange={(v) => setPage(i, { description: v })}
                  />
                  <TextField
                    label="H1"
                    value={page.h1}
                    onChange={(v) => setPage(i, { h1: v })}
                  />
                  <TextAreaField
                    label="Intro"
                    rows={4}
                    value={page.intro}
                    onChange={(v) => setPage(i, { intro: v })}
                  />
                  <ArrayField
                    label="Keywords"
                    value={page.keywords ?? []}
                    onChange={(v) => setPage(i, { keywords: v })}
                  />

                  <SectionLabel>Evidence</SectionLabel>
                  {(page.evidence ?? []).map((item, j) => (
                    <div
                      key={j}
                      className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                    >
                      <TextField
                        label="Project slug (must match a case study)"
                        value={item.slug}
                        onChange={(v) => {
                          const ev = [...page.evidence];
                          ev[j] = { ...ev[j], slug: v };
                          setPage(i, { evidence: ev });
                        }}
                      />
                      <TextField
                        label="Name"
                        value={item.name}
                        onChange={(v) => {
                          const ev = [...page.evidence];
                          ev[j] = { ...ev[j], name: v };
                          setPage(i, { evidence: ev });
                        }}
                      />
                      <TextAreaField
                        label="Note"
                        value={item.note}
                        onChange={(v) => {
                          const ev = [...page.evidence];
                          ev[j] = { ...ev[j], note: v };
                          setPage(i, { evidence: ev });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPage(i, {
                            evidence: page.evidence.filter((_, k) => k !== j),
                          })
                        }
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPage(i, {
                        evidence: [
                          ...(page.evidence ?? []),
                          { slug: "", name: "", note: "" },
                        ],
                      })
                    }
                    className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400"
                  >
                    + Add evidence
                  </button>

                  <SectionLabel>Questions</SectionLabel>
                  {(page.qa ?? []).map((item, j) => (
                    <div
                      key={j}
                      className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                    >
                      <TextField
                        label="Question"
                        value={item.q}
                        onChange={(v) => {
                          const qa = [...page.qa];
                          qa[j] = { ...qa[j], q: v };
                          setPage(i, { qa });
                        }}
                      />
                      <TextAreaField
                        label="Answer"
                        rows={4}
                        value={item.a}
                        onChange={(v) => {
                          const qa = [...page.qa];
                          qa[j] = { ...qa[j], a: v };
                          setPage(i, { qa });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPage(i, { qa: page.qa.filter((_, k) => k !== j) })
                        }
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPage(i, { qa: [...(page.qa ?? []), { q: "", a: "" }] })
                    }
                    className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400"
                  >
                    + Add question
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => updateField("pages", [...pages, { ...BLANK }])}
              className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400"
            >
              + Add hire page
            </button>
          </div>
        );
      }}
    </ConfigEditor>
  );
}
