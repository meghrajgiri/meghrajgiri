"use client";

import { ConfigEditor, TextField, TextAreaField, SectionLabel } from "@/components/admin/ConfigEditor";

export default function HeroConfigPage() {
  return (
    <ConfigEditor configKey="hero" title="Hero Section" description="Main landing area — title, description, stats, and buttons">
      {({ config, updateField }) => {
        const mainTitle = config.mainTitle as Record<string, string>;
        const buttons = config.buttons as Record<string, Record<string, string>>;
        const highlightedTerms = config.highlightedTerms as Record<string, string>;
        const stats = config.stats as Array<Record<string, string>>;

        return (
          <div className="space-y-6">
            <SectionLabel>Title</SectionLabel>
            <TextField label="Line 1" value={mainTitle?.line1} onChange={(v) => updateField("mainTitle.line1", v)} />
            <TextField label="Line 2" value={mainTitle?.line2} onChange={(v) => updateField("mainTitle.line2", v)} />

            <SectionLabel>Description</SectionLabel>
            <TextAreaField label="Description" value={config.description as string} onChange={(v) => updateField("description", v)} />
            <TextField label="Highlighted Term 1" value={highlightedTerms?.term1} onChange={(v) => updateField("highlightedTerms.term1", v)} />
            <TextField label="Highlighted Term 2" value={highlightedTerms?.term2} onChange={(v) => updateField("highlightedTerms.term2", v)} />

            <SectionLabel>Buttons</SectionLabel>
            <TextField label="Primary Button Text" value={buttons?.primary?.text} onChange={(v) => updateField("buttons.primary.text", v)} />
            <TextField label="Primary Button Link" value={buttons?.primary?.href} onChange={(v) => updateField("buttons.primary.href", v)} />
            <TextField label="Secondary Button Text" value={buttons?.secondary?.text} onChange={(v) => updateField("buttons.secondary.text", v)} />
            <TextField label="Secondary Button Link" value={buttons?.secondary?.href} onChange={(v) => updateField("buttons.secondary.href", v)} />

            <SectionLabel>Stats</SectionLabel>
            {stats?.map((stat, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1">
                  <TextField label={`Stat ${i + 1} Value`} value={stat.value} onChange={(v) => { const s = [...stats]; s[i] = { ...s[i], value: v }; updateField("stats", s); }} />
                </div>
                <div className="flex-1">
                  <TextField label={`Stat ${i + 1} Label`} value={stat.label} onChange={(v) => { const s = [...stats]; s[i] = { ...s[i], label: v }; updateField("stats", s); }} />
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </ConfigEditor>
  );
}
