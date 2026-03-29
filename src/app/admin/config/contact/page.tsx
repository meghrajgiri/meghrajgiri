"use client";

import { ConfigEditor, TextField, TextAreaField, SectionLabel } from "@/components/admin/ConfigEditor";

export default function ContactConfigPage() {
  return (
    <ConfigEditor configKey="contact" title="Contact Section" description="Contact info, social links, availability, and form settings">
      {({ config, updateField }) => {
        const contactInfo = config.contactInfo as Record<string, string>;
        const availability = config.availability as Record<string, string>;
        const socialLinks = config.socialLinks as Array<Record<string, string>>;

        return (
          <div className="space-y-6">
            <TextField label="Title" value={config.title as string} onChange={(v) => updateField("title", v)} />
            <TextAreaField label="Subtitle" value={config.subtitle as string} onChange={(v) => updateField("subtitle", v)} />

            <SectionLabel>Contact Info</SectionLabel>
            <TextField label="Email" value={contactInfo?.email} onChange={(v) => updateField("contactInfo.email", v)} type="email" />
            <TextField label="Phone" value={contactInfo?.phone} onChange={(v) => updateField("contactInfo.phone", v)} />
            <TextField label="Location" value={contactInfo?.location} onChange={(v) => updateField("contactInfo.location", v)} />

            <SectionLabel>Availability</SectionLabel>
            <TextField label="Status" value={availability?.status} onChange={(v) => updateField("availability.status", v)} />
            <TextField label="Response Time" value={availability?.responseTime} onChange={(v) => updateField("availability.responseTime", v)} />
            <TextField label="Working Hours" value={availability?.workingHours} onChange={(v) => updateField("availability.workingHours", v)} />

            <SectionLabel>Social Links</SectionLabel>
            {socialLinks?.map((link, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24">
                  <TextField label="Platform" value={link.platform} onChange={(v) => { const s = [...socialLinks]; s[i] = { ...s[i], platform: v }; updateField("socialLinks", s); }} />
                </div>
                <div className="flex-1">
                  <TextField label="URL" value={link.url} onChange={(v) => { const s = [...socialLinks]; s[i] = { ...s[i], url: v }; updateField("socialLinks", s); }} />
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </ConfigEditor>
  );
}
