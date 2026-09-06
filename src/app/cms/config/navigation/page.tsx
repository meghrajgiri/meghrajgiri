"use client";

import {
  ConfigEditor,
  TextField,
  SectionLabel,
} from "@/components/admin/ConfigEditor";

export default function NavigationConfigPage() {
  return (
    <ConfigEditor
      configKey="navigation"
      title="Navigation"
      description="Header nav items and mobile menu settings"
    >
      {({ config, updateField }) => {
        const items = config.items as Array<Record<string, string>>;
        const mobileMenu = config.mobileMenu as Record<string, string>;

        return (
          <div className="space-y-6">
            <SectionLabel>Nav Items</SectionLabel>
            {items?.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1">
                  <TextField
                    label="Label"
                    value={item.label}
                    onChange={(v) => {
                      const it = [...items];
                      it[i] = { ...it[i], label: v };
                      updateField("items", it);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Href"
                    value={item.href}
                    onChange={(v) => {
                      const it = [...items];
                      it[i] = { ...it[i], href: v };
                      updateField("items", it);
                    }}
                  />
                </div>
              </div>
            ))}

            <SectionLabel>Mobile Menu</SectionLabel>
            <TextField
              label="Footer Text"
              value={mobileMenu?.footer}
              onChange={(v) => updateField("mobileMenu.footer", v)}
            />
          </div>
        );
      }}
    </ConfigEditor>
  );
}
