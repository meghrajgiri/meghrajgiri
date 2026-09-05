"use client";

import {
  ConfigEditor,
  SectionLabel,
  TextAreaField,
  TextField,
  ArrayField,
} from "@/components/admin/ConfigEditor";

/**
 * Per-page titles, descriptions and lead copy.
 *
 * These are the strings most worth changing once Search Console has real data, and
 * until now they were constants in the page components — so tuning a title meant a
 * code change and a deploy. Every field here is optional: a blank value falls back to
 * the copy compiled into the page rather than rendering an empty `<title>`.
 */

/** `heading` and `intro` only exist for pages that render them. */
const PAGES: Array<{ key: string; label: string; hint: string; lead?: boolean }> = [
  { key: "about", label: "About", hint: "/about — the entity anchor page", lead: true },
  { key: "experience", label: "Experience", hint: "/experience", lead: true },
  { key: "skills", label: "Skills", hint: "/skills", lead: true },
  { key: "hire", label: "Hire", hint: "/hire — hire-intent hub", lead: true },
  { key: "blog", label: "Articles", hint: "/blog — article index", lead: true },
  { key: "contact", label: "Contact", hint: "/contact" },
  { key: "projects", label: "Case Studies", hint: "/projects" },
];

type PageCopy = {
  title?: string;
  description?: string;
  heading?: string;
  intro?: string;
  keywords?: string[];
};

export default function PagesConfigPage() {
  return (
    <ConfigEditor
      configKey="pages"
      title="Pages"
      description="Title, description and lead copy for each page"
    >
      {({ config, updateField }) => (
        <div className="space-y-6">
          {PAGES.map(({ key, label, hint, lead }) => {
            const page = (config[key] as PageCopy) ?? {};
            const set = (field: keyof PageCopy, value: unknown) =>
              updateField(key, { ...page, [field]: value });

            return (
              <div key={key} className="space-y-4">
                <SectionLabel>{label}</SectionLabel>
                <p className="-mt-2 text-xs text-gray-500">{hint}</p>
                <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <TextField
                    label="Title tag"
                    value={page.title ?? ""}
                    onChange={(v) => set("title", v)}
                  />
                  <TextAreaField
                    label="Meta description"
                    value={page.description ?? ""}
                    onChange={(v) => set("description", v)}
                  />
                  {lead && (
                    <>
                      <TextField
                        label="Heading (H1 on the page)"
                        value={page.heading ?? ""}
                        onChange={(v) => set("heading", v)}
                      />
                      <TextAreaField
                        label="Intro paragraph"
                        value={page.intro ?? ""}
                        onChange={(v) => set("intro", v)}
                      />
                    </>
                  )}
                  <ArrayField
                    label="Keywords"
                    value={page.keywords ?? []}
                    onChange={(v) => set("keywords", v)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ConfigEditor>
  );
}
