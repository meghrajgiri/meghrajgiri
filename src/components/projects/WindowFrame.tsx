/**
 * A macOS-window title bar, used as the card language across the site.
 *
 * This is the part of the terminal screenshot worth keeping: the chrome, not the
 * shell. Every project card becomes a window onto the work, which gives the grid a
 * consistent frame and a reason for the mono type without pretending to be a
 * functioning terminal.
 *
 * The dots are decoration, not controls — they carry no label and are hidden from
 * assistive tech, because announcing "red circle, yellow circle" three times per card
 * is noise.
 */
export function WindowBar({ path, tone = "light" }: { path: string; tone?: "light" | "dark" }) {
  return (
    <div
      className={`flex items-center gap-2 border-b-2 border-border px-3.5 py-2.5 ${
        tone === "dark" ? "bg-[#242423]" : "bg-secondary"
      }`}
    >
      <span aria-hidden className="flex gap-1.5">
        <span className="h-[11px] w-[11px] rounded-full border border-border/40 bg-[#FF5F57]" />
        <span className="h-[11px] w-[11px] rounded-full border border-border/40 bg-[#FEBC2E]" />
        <span className="h-[11px] w-[11px] rounded-full border border-border/40 bg-[#28C840]" />
      </span>
      <span
        className={`truncate font-mono text-[11px] ${
          tone === "dark" ? "text-[#A0B7AB]" : "text-muted-foreground"
        }`}
      >
        {path}
      </span>
    </div>
  );
}
