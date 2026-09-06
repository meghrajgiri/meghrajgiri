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
      actions={<AdminSaveButton onClick={handleSave} saving={saving} disabled={loading} />}
    >
      {config ? (
        children({ config, updateField })
      ) : (
        <p className="text-gray-500">Failed to load config.</p>
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="text"
        value={(value || []).join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
        placeholder="Comma-separated values"
      />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-gray-200 pb-2 pt-4 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:text-gray-500">
      {children}
    </h3>
  );
}
