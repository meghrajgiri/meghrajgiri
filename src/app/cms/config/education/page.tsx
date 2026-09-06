"use client";

import {
  ConfigEditor,
  TextField,
  TextAreaField,
  SectionLabel,
  ArrayField,
} from "@/components/admin/ConfigEditor";

export default function EducationConfigPage() {
  return (
    <ConfigEditor
      configKey="education"
      title="Education"
      description="Education history and academic highlights"
    >
      {({ config, updateField }) => {
        const education = config.education as Array<Record<string, unknown>>;
        const highlights = config.highlights as Array<Record<string, string>>;

        return (
          <div className="space-y-6">
            <TextField
              label="Title"
              value={config.title as string}
              onChange={(v) => updateField("title", v)}
            />
            <TextField
              label="Subtitle"
              value={config.subtitle as string}
              onChange={(v) => updateField("subtitle", v)}
            />

            <SectionLabel>Institutions</SectionLabel>
            {education?.map((edu, i) => (
              <div
                key={i}
                className="space-y-4 rounded-[6px] border border-border p-4"
              >
                <TextField
                  label="Degree"
                  value={edu.degree as string}
                  onChange={(v) => {
                    const e = [...education];
                    e[i] = { ...e[i], degree: v };
                    updateField("education", e);
                  }}
                />
                <TextField
                  label="Field"
                  value={edu.field as string}
                  onChange={(v) => {
                    const e = [...education];
                    e[i] = { ...e[i], field: v };
                    updateField("education", e);
                  }}
                />
                <TextField
                  label="Institution"
                  value={edu.institution as string}
                  onChange={(v) => {
                    const e = [...education];
                    e[i] = { ...e[i], institution: v };
                    updateField("education", e);
                  }}
                />
                <TextField
                  label="Period"
                  value={edu.period as string}
                  onChange={(v) => {
                    const e = [...education];
                    e[i] = { ...e[i], period: v };
                    updateField("education", e);
                  }}
                />
                <TextAreaField
                  label="Description"
                  value={edu.description as string}
                  onChange={(v) => {
                    const e = [...education];
                    e[i] = { ...e[i], description: v };
                    updateField("education", e);
                  }}
                />
                <ArrayField
                  label="Skills"
                  value={edu.skills as string[]}
                  onChange={(v) => {
                    const e = [...education];
                    e[i] = { ...e[i], skills: v };
                    updateField("education", e);
                  }}
                />
              </div>
            ))}

            <SectionLabel>Highlights</SectionLabel>
            {highlights?.map((h, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1">
                  <TextField
                    label="Value"
                    value={h.value}
                    onChange={(v) => {
                      const hl = [...highlights];
                      hl[i] = { ...hl[i], value: v };
                      updateField("highlights", hl);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Label"
                    value={h.label}
                    onChange={(v) => {
                      const hl = [...highlights];
                      hl[i] = { ...hl[i], label: v };
                      updateField("highlights", hl);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </ConfigEditor>
  );
}
