"use client";

import { ConfigEditor, TextField, TextAreaField, SectionLabel } from "@/components/admin/ConfigEditor";

export default function AboutConfigPage() {
  return (
    <ConfigEditor configKey="about" title="About Section" description="Overview, description, stats, and call to action">
      {({ config, updateField }) => {
        const description = config.description as string[];
        const stats = config.stats as Array<Record<string, string>>;
        const cta = config.callToAction as Record<string, string>;

        return (
          <div className="space-y-6">
            <TextField label="Badge" value={config.badge as string} onChange={(v) => updateField("badge", v)} />
            <TextField label="Title" value={config.title as string} onChange={(v) => updateField("title", v)} />
            <TextField label="Subtitle" value={config.subtitle as string} onChange={(v) => updateField("subtitle", v)} />

            <SectionLabel>Description Paragraphs</SectionLabel>
            {description?.map((para, i) => (
              <TextAreaField key={i} label={`Paragraph ${i + 1}`} value={para} onChange={(v) => { const d = [...description]; d[i] = v; updateField("description", d); }} />
            ))}

            <SectionLabel>Stats</SectionLabel>
            {stats?.map((stat, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1">
                  <TextField label={`Value`} value={stat.value} onChange={(v) => { const s = [...stats]; s[i] = { ...s[i], value: v }; updateField("stats", s); }} />
                </div>
                <div className="flex-1">
                  <TextField label={`Label`} value={stat.label} onChange={(v) => { const s = [...stats]; s[i] = { ...s[i], label: v }; updateField("stats", s); }} />
                </div>
              </div>
            ))}

            <SectionLabel>Call to Action</SectionLabel>
            <TextField label="CTA Title" value={cta?.title} onChange={(v) => updateField("callToAction.title", v)} />
            <TextAreaField label="CTA Description" value={cta?.description} onChange={(v) => updateField("callToAction.description", v)} />
            <TextField label="CTA Button Text" value={cta?.buttonText} onChange={(v) => updateField("callToAction.buttonText", v)} />
          </div>
        );
      }}
    </ConfigEditor>
  );
}
