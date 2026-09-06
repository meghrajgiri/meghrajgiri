"use client";

import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export type AdminMessage = { type: "success" | "error"; text: string } | null;

/**
 * The chrome every CMS screen shares: auth gate, sidebar, sticky header, message
 * banner.
 *
 * Extracted from `ConfigEditor` when project editing moved onto pages of its own.
 * `ConfigEditor` owns a config section's fetch-and-save cycle, which a per-project
 * page does not use — but the surrounding page is meant to look identical, and a
 * second hand-copied header would drift from the first within a release.
 */
export function AdminShell({
  title,
  description,
  actions,
  message,
  loading,
  children,
  wide,
}: {
  title: string;
  description: string;
  /** Buttons for the header — Save, Back, and so on. */
  actions?: React.ReactNode;
  message?: AdminMessage;
  loading?: boolean;
  children: React.ReactNode;
  /** Lists read better wider than forms do. */
  wide?: boolean;
}) {
  return (
    <AdminAuth>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="bg-card/80 /80 sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border px-8 backdrop-blur-sm">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-foreground">
                {title}
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">{actions}</div>
          </div>

          <div className={`mx-auto p-8 ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
            {message && (
              <div
                className={`mb-6 rounded-[6px] px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            {loading ? <AdminSkeleton /> : children}
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}

export function AdminSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded-[6px] bg-muted" />
        </div>
      ))}
    </div>
  );
}

/** The header's primary action, so Save looks the same on every screen. */
export function AdminSaveButton({
  onClick,
  saving,
  disabled,
  label = "Save Changes",
}: {
  onClick: () => void;
  saving?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving || disabled}
      className="rounded-[6px] bg-card px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
    >
      {saving ? "Saving..." : label}
    </button>
  );
}
