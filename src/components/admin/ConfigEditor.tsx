"use client";

import {
  AdminSaveButton,
  AdminShell,
  type AdminMessage,
} from "@/components/admin/AdminShell";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

interface ConfigEditorProps {
  configKey: string;
  title: string;
  description: string;
  children: (props: {
    config: Record<string, unknown>;
    updateField: (path: string, value: unknown) => void;
  }) => React.ReactNode;
}

export function ConfigEditor({
  configKey,
  title,
  description,
  children,
}: ConfigEditorProps) {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<AdminMessage>(null);

  // Memoised so the effect below can depend on it honestly. Without useCallback the
  // function is a new value every render, so either the effect loops or the dependency
  // has to be suppressed.
  const fetchConfig = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`/api/config?key=${configKey}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      const data = await res.json();
      if (data.value) setConfig(data.value);
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  }, [configKey]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ key: configKey, value: config }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Config saved!" });
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save config." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateField = (path: string, value: unknown) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  return (
    <AdminShell
      title={title}
      description={description}
      message={message}
      loading={loading}
      actions={
        <AdminSaveButton
          onClick={handleSave}
          saving={saving}
          disabled={loading}
        />
      }
    >
      {config ? (
        children({ config, updateField })
      ) : (
        <p className="text-muted-foreground">Failed to load config.</p>
      )}
    </AdminShell>
  );
}

// Reusable field components
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
  /** Shown under the field. Say why a disabled field is disabled. */
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-[6px] border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-faint"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-[6px] border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

export function ArrayField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <input
        type="text"
        value={(value || []).join(",")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        className="w-full rounded-[6px] border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-ring"
        placeholder="Comma-separated values"
      />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-border pb-2 pt-4 text-sm font-semibold uppercase tracking-wider text-faint">
      {children}
    </h3>
  );
}
