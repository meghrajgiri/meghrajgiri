"use client";

import {
  ConfigEditor,
  TextField,
  TextAreaField,
  SectionLabel,
} from "@/components/admin/ConfigEditor";

export default function ContactConfigPage() {
  return (
    <ConfigEditor
      configKey="contact"
      title="Contact Section"
      description="Contact info, social links, availability, and form settings"
    >
      {({ config, updateField }) => {
        const contactInfo = config.contactInfo as Record<string, string>;
        const availability = config.availability as Record<string, string>;
        const socialLinks = config.socialLinks as Array<Record<string, string>>;

        return (
          <div className="space-y-6">
            <TextField
              label="Title"
              value={config.title as string}
              onChange={(v) => updateField("title", v)}
            />
            <TextAreaField
              label="Subtitle"
              value={config.subtitle as string}
              onChange={(v) => updateField("subtitle", v)}
            />

            <SectionLabel>Contact Info</SectionLabel>
            <TextField
              label="Email"
              value={contactInfo?.email}
              onChange={(v) => updateField("contactInfo.email", v)}
              type="email"
            />
            <TextField
              label="Phone"
              value={contactInfo?.phone}
              onChange={(v) => updateField("contactInfo.phone", v)}
            />
            <TextField
              label="Location"
              value={contactInfo?.location}
              onChange={(v) => updateField("contactInfo.location", v)}
            />

            <SectionLabel>Availability</SectionLabel>
            <TextField
              label="Status"
              value={availability?.status}
              onChange={(v) => updateField("availability.status", v)}
            />
            <TextField
              label="Response Time"
              value={availability?.responseTime}
              onChange={(v) => updateField("availability.responseTime", v)}
            />
            <TextField
              label="Working Hours"
              value={availability?.workingHours}
              onChange={(v) => updateField("availability.workingHours", v)}
            />

            <SectionLabel>Social Links</SectionLabel>
            {/* These rows are the Connect column in the footer, and their http URLs
                are also what feeds `sameAs` in the Person structured data. Adding a
                row here is the whole job — no component knows the list's length.

                Previously this section could only edit `platform` and `url` on rows
                that already existed: there was no way to add a link at all, and `name`
                — the text the footer actually renders — was not editable, so a new
                entry would have shown up blank even if one could be created. */}
            <button
              type="button"
              onClick={() =>
                updateField("socialLinks", [
                  ...(socialLinks ?? []),
                  { platform: "", name: "", url: "", icon: "", label: "" },
                ])
              }
              className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add link
            </button>

            {socialLinks?.map((link, i) => {
              const update = (field: string, v: string) => {
                const s = [...socialLinks];
                s[i] = { ...s[i], [field]: v };
                updateField("socialLinks", s);
              };
              return (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-[6px] border border-border p-4"
                >
                  <div className="flex flex-wrap gap-4">
                    <div className="w-32">
                      <TextField
                        label="Platform"
                        value={link.platform}
                        onChange={(v) => update("platform", v)}
                      />
                    </div>
                    <div className="w-40">
                      {/* What the footer prints. */}
                      <TextField
                        label="Label"
                        value={link.name}
                        onChange={(v) => update("name", v)}
                      />
                    </div>
                    <div className="min-w-[240px] flex-1">
                      <TextField
                        label="URL"
                        value={link.url}
                        onChange={(v) => update("url", v)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "socialLinks",
                        socialLinks.filter((_, j) => j !== i),
                      )
                    }
                    className="self-start rounded-[6px] px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        );
      }}
    </ConfigEditor>
  );
}
