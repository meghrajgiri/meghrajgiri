"use client";

import { ConfigEditor, TextField, TextAreaField, SectionLabel, ArrayField } from "@/components/admin/ConfigEditor";

export default function ExperienceConfigPage() {
  return (
    <ConfigEditor configKey="experience" title="Experience" description="Work history shown in the Journey tab">
      {({ config, updateField }) => {
        const experiences = config.experiences as Array<Record<string, unknown>>;

        const addExperience = () => {
          updateField("experiences", [
            {
              year: new Date().getFullYear().toString(),
              period: "Present",
              title: "",
              company: "",
              type: "Full-time",
              description: "",
              technologies: [],
              status: "current",
            },
            ...experiences,
          ]);
        };

        const removeExperience = (index: number) => {
          const e = experiences.filter((_, j) => j !== index);
          updateField("experiences", e);
        };

        return (
          <div className="space-y-6">
            <button
              onClick={addExperience}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-100 dark:hover:text-gray-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Experience
            </button>

            {experiences?.map((exp, i) => (
              <div key={i} className="relative space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <SectionLabel>{(exp.title as string) || `Experience ${i + 1}`}</SectionLabel>
                  <button
                    onClick={() => removeExperience(i)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <TextField label="Year Start" value={exp.year as string} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], year: v }; updateField("experiences", e); }} />
                  </div>
                  <div className="flex-1">
                    <TextField label="Year End" value={exp.period as string} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], period: v }; updateField("experiences", e); }} />
                  </div>
                </div>
                <TextField label="Title" value={exp.title as string} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], title: v }; updateField("experiences", e); }} />
                <TextField label="Company" value={exp.company as string} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], company: v }; updateField("experiences", e); }} />
                <TextField label="Type" value={exp.type as string} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], type: v }; updateField("experiences", e); }} />
                <TextAreaField label="Description" value={exp.description as string} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], description: v }; updateField("experiences", e); }} />
                <ArrayField label="Technologies" value={exp.technologies as string[]} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], technologies: v }; updateField("experiences", e); }} />
                <TextField label="Status" value={exp.status as string} onChange={(v) => { const e = [...experiences]; e[i] = { ...e[i], status: v }; updateField("experiences", e); }} />
              </div>
            ))}
          </div>
        );
      }}
    </ConfigEditor>
  );
}
