"use client";

import {
  ConfigEditor,
  TextField,
  TextAreaField,
  SectionLabel,
} from "@/components/admin/ConfigEditor";

export default function HeroConfigPage() {
  return (
    <ConfigEditor
      configKey="hero"
      title="Hero Section"
      description="Main landing area — title, description, stats, and buttons"
    >
      {({ config, updateField }) => {
        const mainTitle = config.mainTitle as Record<string, string>;
        const buttons = config.buttons as Record<
          string,
          Record<string, string>
        >;
        const highlightedTerms = config.highlightedTerms as Record<
          string,
          string
        >;
        const stats = config.stats as Array<Record<string, string>>;

        return (
          <div className="space-y-6">
            <SectionLabel>Title</SectionLabel>
            <TextField
              label="Line 1"
              value={mainTitle?.line1}
              onChange={(v) => updateField("mainTitle.line1", v)}
            />
            <TextField
              label="Line 2"
              value={mainTitle?.line2}
              onChange={(v) => updateField("mainTitle.line2", v)}
            />

            <SectionLabel>Description</SectionLabel>
            <TextAreaField
              label="Description"
              value={config.description as string}
              onChange={(v) => updateField("description", v)}
            />
            <TextField
              label="Highlighted Term 1"
              value={highlightedTerms?.term1}
              onChange={(v) => updateField("highlightedTerms.term1", v)}
            />
            <TextField
              label="Highlighted Term 2"
              value={highlightedTerms?.term2}
              onChange={(v) => updateField("highlightedTerms.term2", v)}
            />

            <SectionLabel>Buttons</SectionLabel>
            <TextField
              label="Primary Button Text"
              value={buttons?.primary?.text}
              onChange={(v) => updateField("buttons.primary.text", v)}
            />
            <TextField
              label="Primary Button Link"
              value={buttons?.primary?.href}
              onChange={(v) => updateField("buttons.primary.href", v)}
            />
            <TextField
              label="Secondary Button Text"
              value={buttons?.secondary?.text}
              onChange={(v) => updateField("buttons.secondary.text", v)}
            />
            <TextField
              label="Secondary Button Link"
              value={buttons?.secondary?.href}
              onChange={(v) => updateField("buttons.secondary.href", v)}
            />

            <SectionLabel>Stats</SectionLabel>
            {/* The hero shows three stat cards and only this one is editable.
                Card 1 is professional experience, computed from Personal ->
                Career start date. Card 3 is the published case-study count,
                computed from Projects. Neither can be typed here, because a
                hand-entered figure goes stale silently and these two do not. */}
            <p className="text-sm text-muted-foreground">
              The hero shows three stats. The first (professional experience)
              and the third (case studies) are calculated automatically — from{" "}
              <strong className="font-medium text-foreground">
                Personal &rarr; Career start date
              </strong>{" "}
              and from the number of published projects. This is the one you set
              yourself.
            </p>

            {stats?.length ? (
              stats.slice(0, 1).map((stat, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-1">
                    <TextField
                      label="Value"
                      value={stat.value}
                      onChange={(v) => {
                        const s = [...stats];
                        s[i] = { ...s[i], value: v };
                        updateField("stats", s);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      label="Label"
                      value={stat.label}
                      onChange={(v) => {
                        const s = [...stats];
                        s[i] = { ...s[i], label: v };
                        updateField("stats", s);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              /* Without this the editor is a dead end: the fields are rendered by
                 mapping the array, so once it is empty there is no control left to
                 add one back and the middle card can never return. */
              <button
                type="button"
                onClick={() => updateField("stats", [{ value: "", label: "" }])}
                className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                Add the manual stat
              </button>
            )}
          </div>
        );
      }}
    </ConfigEditor>
  );
}
