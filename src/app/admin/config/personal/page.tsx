"use client";

import { ConfigEditor, TextField } from "@/components/admin/ConfigEditor";

export default function PersonalConfigPage() {
  return (
    <ConfigEditor
      configKey="personal"
      title="Personal Info"
      description="Name, role, and basic details shown across the site"
    >
      {({ config, updateField }) => (
        <div className="space-y-6">
          <TextField label="Full Name" value={config.name as string} onChange={(v) => updateField("name", v)} />
          <TextField label="Role / Title" value={config.role as string} onChange={(v) => updateField("role", v)} />
          <TextField label="Initials" value={config.initials as string} onChange={(v) => updateField("initials", v)} />
          <TextField label="Email" value={config.email as string} onChange={(v) => updateField("email", v)} type="email" />
          <TextField label="Location" value={config.location as string} onChange={(v) => updateField("location", v)} />
          <TextField label="Tagline" value={config.tagline as string} onChange={(v) => updateField("tagline", v)} />
        </div>
      )}
    </ConfigEditor>
  );
}
