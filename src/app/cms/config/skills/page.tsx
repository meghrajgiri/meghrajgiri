"use client";

import { ConfigEditor, TextField } from "@/components/admin/ConfigEditor";

export default function SkillsConfigPage() {
  return (
    <ConfigEditor configKey="skills" title="Skills Section" description="Badge, title, subtitle, and skill categories">
      {({ config, updateField }) => (
        <div className="space-y-6">
          <TextField label="Badge" value={config.badge as string} onChange={(v) => updateField("badge", v)} />
          <TextField label="Title" value={config.title as string} onChange={(v) => updateField("title", v)} />
          <TextField label="Subtitle" value={config.subtitle as string} onChange={(v) => updateField("subtitle", v)} />
          <p className="text-xs text-gray-500">Skill categories and items are configured in the code. Use the fields above to update section text.</p>
        </div>
      )}
    </ConfigEditor>
  );
}
