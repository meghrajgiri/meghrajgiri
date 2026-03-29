"use client";

import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, [configKey]);

  const fetchConfig = async () => {
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
  };

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
    <AdminAuth>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="mx-auto max-w-2xl p-8">
            {message && (
              <div
                className={`mb-6 rounded-lg px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-900" />
                  </div>
                ))}
              </div>
            ) : config ? (
              children({ config, updateField })
            ) : (
              <p className="text-gray-500">Failed to load config.</p>
            )}
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}

// Reusable field components
export function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
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
        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
      />
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
