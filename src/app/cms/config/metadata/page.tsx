"use client";

import {
  ConfigEditor,
  TextField,
  TextAreaField,
  ArrayField,
} from "@/components/admin/ConfigEditor";

export default function MetadataConfigPage() {
  return (
    <ConfigEditor
      configKey="metadata"
      title="Metadata / SEO"
      description="Site title, description, OG tags, and social metadata"
    >
      {({ config, updateField }) => (
        <div className="space-y-6">
          <TextField
            label="Site Title"
            value={config.title as string}
            onChange={(v) => updateField("title", v)}
          />
          <TextAreaField
            label="Description"
            value={config.description as string}
            onChange={(v) => updateField("description", v)}
          />
          <ArrayField
            label="Keywords"
            value={config.keywords as string[]}
            onChange={(v) => updateField("keywords", v)}
          />
          <TextField
            label="Author"
            value={config.author as string}
            onChange={(v) => updateField("author", v)}
          />
          <TextField
            label="Site URL"
            value={config.url as string}
            onChange={(v) => updateField("url", v)}
          />
          <TextField
            label="Site Name"
            value={config.siteName as string}
            onChange={(v) => updateField("siteName", v)}
          />
          <TextField
            label="Twitter Handle"
            value={config.twitter as string}
            onChange={(v) => updateField("twitter", v)}
          />
          <TextField
            label="Locale"
            value={config.locale as string}
            onChange={(v) => updateField("locale", v)}
          />
        </div>
      )}
    </ConfigEditor>
  );
}
