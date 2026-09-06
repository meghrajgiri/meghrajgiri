"use client";

import { useEffect, useRef } from "react";

/**
 * A confirmation the CMS owns.
 *
 * `window.confirm` was doing this job. It is functional, but it renders as the browser's
 * chrome rather than as part of the page, it cannot say which project it is about in any
 * way the eye can scan, and it blocks the main thread so nothing can show progress while
 * the action runs.
 *
 * The behaviour a native dialog gave for free has to be rebuilt deliberately: Escape
 * closes, the backdrop closes, focus moves into the dialog and cannot leave it by Tab,
 * and the page behind does not scroll. Cancel takes focus rather than the destructive
 * button, so a stray Return dismisses instead of deletes.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  tone = "default",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  /**
   * Red is for actions that cannot be undone. Using it for a reversible one teaches
   * people to ignore it, which costs exactly when it is finally telling the truth.
   */
  tone?: "default" | "danger";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        onCancel();
        return;
      }

      // Two focusable controls, so the trap is a cycle between them. Without it, Tab
      // walks into the page behind the backdrop, where a click does nothing and the
      // focus ring is invisible.
      if (event.key === "Tab") {
        const first = cancelRef.current;
        const last = confirmRef.current;
        if (!first || !last) return;

        event.preventDefault();
        const forward = !event.shiftKey;
        const active = document.activeElement;
        (forward
          ? active === first
            ? last
            : first
          : active === last
            ? first
            : last
        ).focus();
      }
    };

    document.addEventListener("keydown", onKey);

    // Restored rather than set to"auto": the value here may not have been the default.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="bg-card/50 fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        // The backdrop closes on click; the panel must not pass its own clicks up to it.
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-[6px] bg-card p-6 shadow-xl"
      >
        <h2
          id="confirm-dialog-title"
          className="text-base font-semibold text-foreground"
        >
          {title}
        </h2>

        <div className="mt-2 text-sm text-muted-foreground">{body}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-[6px] border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-[6px] px-4 py-2 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-50 ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {busy ? `${confirmLabel}…` : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
