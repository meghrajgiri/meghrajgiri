"use client";

import {
  ArrayField,
  ConfigEditor,
  SectionLabel,
  TextField,
} from "@/components/admin/ConfigEditor";

export default function PersonalConfigPage() {
  return (
    <ConfigEditor
      configKey="personal"
      title="Personal Info"
      description="Name, role, and basic details shown across the site"
    >
      {({ config, updateField }) => (
        <div className="space-y-6">
          <TextField
            label="Full Name"
            value={config.name as string}
            onChange={(v) => updateField("name", v)}
          />
          <TextField
            label="Role / Title"
            value={config.role as string}
            onChange={(v) => updateField("role", v)}
          />
          <TextField
            label="Initials"
            value={config.initials as string}
            onChange={(v) => updateField("initials", v)}
          />
          <TextField
            label="Email"
            value={config.email as string}
            onChange={(v) => updateField("email", v)}
            type="email"
          />
          <TextField
            label="Location"
            value={config.location as string}
            onChange={(v) => updateField("location", v)}
          />
          <TextField
            label="Tagline"
            value={config.tagline as string}
            onChange={(v) => updateField("tagline", v)}
          />
          {/* Drives the hero's "Professional experience" figure. The experience
              entries only store years, so months and days cannot be derived from
              them — this is the only place the exact day lives. Leave it blank and
              the hero falls back to the configured stat instead. */}
          <TextField
            label="Career start date (YYYY-MM-DD)"
            value={config.careerStart as string}
            onChange={(v) => updateField("careerStart", v)}
            type="date"
          />

          {/* These drive the Person structured data. They used to be constants in
              src/lib/schema.ts, which meant the site described one person from two
              places — and shipped `addressLocality:"Nepal"` for months as a result."Location" above is the display string; these are the machine-readable
              parts. */}
          <SectionLabel>Search engine identity</SectionLabel>
          <p className="-mt-2 text-xs text-muted-foreground">
            Used in the Person structured data that tells Google and AI search
            which Meghraj this is. Locality means the city specifically.
          </p>
          <TextField
            label="City / locality"
            value={config.locality as string}
            onChange={(v) => updateField("locality", v)}
          />
          <TextField
            label="Region / province"
            value={config.region as string}
            onChange={(v) => updateField("region", v)}
          />
          <TextField
            label="Country code (e.g. NP)"
            value={config.country as string}
            onChange={(v) => updateField("country", v)}
          />
          <ArrayField
            label="Profile URLs (Toptal, Arc, Upwork — not social links)"
            value={(config.profiles as string[]) ?? []}
            onChange={(v) => updateField("profiles", v)}
          />

          <SectionLabel>Credentials</SectionLabel>
          <p className="-mt-2 text-xs text-muted-foreground">
            Only credentials a third party issued. These are worth more than any
            self-description because someone else had to agree to them.
          </p>
          {((config.credentials as Array<Record<string, string>>) ?? []).map(
            (cred, i) => {
              const creds =
                (config.credentials as Array<Record<string, string>>) ?? [];
              const set = (field: string, value: string) => {
                const next = [...creds];
                next[i] = { ...next[i], [field]: value };
                updateField("credentials", next);
              };
              return (
                <div
                  key={i}
                  className="space-y-4 rounded-[6px] border border-border p-4"
                >
                  <TextField
                    label="Name"
                    value={cred.name}
                    onChange={(v) => set("name", v)}
                  />
                  <TextField
                    label="Issued by"
                    value={cred.issuer}
                    onChange={(v) => set("issuer", v)}
                  />
                  <TextField
                    label="Category"
                    value={cred.category}
                    onChange={(v) => set("category", v)}
                  />
                  <TextField
                    label="URL (optional)"
                    value={cred.url}
                    onChange={(v) => set("url", v)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "credentials",
                        creds.filter((_, j) => j !== i),
                      )
                    }
                    className="text-xs text-red-600 hover:underline dark:text-red-400"
                  >
                    Remove credential
                  </button>
                </div>
              );
            },
          )}
          <button
            type="button"
            onClick={() =>
              updateField("credentials", [
                ...((config.credentials as Array<Record<string, string>>) ??
                  []),
                { name: "", issuer: "", category: "", url: "" },
              ])
            }
            className="rounded-[6px] border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-border-strong"
          >
            + Add credential
          </button>
        </div>
      )}
    </ConfigEditor>
  );
}
