"use client";

import {
  SectionLabel,
  TextAreaField,
  TextField,
} from "@/components/admin/ConfigEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

/**
 * Case study editing.
 *
 * The CMS could edit a project's title, images and links but not a word of its case
 * study, so writing one meant hand-editing JSON in the database. That is why seven of
 * eight projects had none.
 *
 * The section headings offered below are the structure from
 * `docs/case-studies/STRUCTURE.md` — offered rather than enforced, since a project may
 * warrant its own. Order matters: outcome-bearing blocks first, because readers scan
 * for the result before deciding whether to read.
 */

export type CaseStudy = {
  summary?: string;
  facts?: { role?: string; timeline?: string; team?: string; status?: string };
  metrics?: Array<{ value: string; label: string }>;
  sections?: Array<{ heading: string; body: string }>;
};

/** Core applies to every project; depth is for the two or three flagships. */
const SUGGESTED_SECTIONS = [
  { heading: "The problem", tier: "core" },
  { heading: "What I built", tier: "core" },
  { heading: "Constraints", tier: "depth" },
  { heading: "Key decisions", tier: "depth" },
  { heading: "Where it got hard", tier: "depth" },
  { heading: "What I'd do differently", tier: "depth" },
] as const;

export function CaseStudyEditor({
  caseStudy,
  onChange,
}: {
  caseStudy: CaseStudy;
  onChange: (next: CaseStudy) => void;
}) {
  const cs = caseStudy ?? {};
  const sections = cs.sections ?? [];
  const metrics = cs.metrics ?? [];

  const set = (patch: Partial<CaseStudy>) => onChange({ ...cs, ...patch });

  const addSection = (heading: string) =>
    set({ sections: [...sections, { heading, body: "" }] });

  const used = new Set(sections.map((s) => s.heading));

  return (
    <div className="space-y-6">
      <SectionLabel>Case study</SectionLabel>
      <p className="-mt-2 text-xs text-muted-foreground">
        Structure and guidance: docs/case-studies/STRUCTURE.md. Leave a block
        empty rather than filling it with a placeholder — an unfilled bracket
        once shipped to production for weeks.
      </p>

      <TextAreaField
        label="Summary — what it is, who for, what was hard (2-3 sentences)"
        rows={4}
        value={cs.summary ?? ""}
        onChange={(v) => set({ summary: v })}
      />

      <SectionLabel>Facts</SectionLabel>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Your role"
          value={cs.facts?.role ?? ""}
          onChange={(v) => set({ facts: { ...cs.facts, role: v } })}
        />
        <TextField
          label="Timeline"
          value={cs.facts?.timeline ?? ""}
          onChange={(v) => set({ facts: { ...cs.facts, timeline: v } })}
        />
        <TextField
          label="Team"
          value={cs.facts?.team ?? ""}
          onChange={(v) => set({ facts: { ...cs.facts, team: v } })}
        />
        <TextField
          label="Status"
          value={cs.facts?.status ?? ""}
          onChange={(v) => set({ facts: { ...cs.facts, status: v } })}
        />
      </div>

      <SectionLabel>Metrics</SectionLabel>
      <p className="-mt-2 text-xs text-muted-foreground">
        Up to three. If the commercial numbers are not yours to publish, use
        delivery or performance facts instead — and if there are none, leave
        this empty. The row does not render when there is nothing in it.
      </p>
      {metrics.map((m, i) => (
        <div key={i} className="flex items-end gap-3">
          <div className="w-32">
            <TextField
              label="Value"
              value={m.value}
              onChange={(v) => {
                const next = [...metrics];
                next[i] = { ...next[i], value: v };
                set({ metrics: next });
              }}
            />
          </div>
          <div className="flex-1">
            <TextField
              label="Label"
              value={m.label}
              onChange={(v) => {
                const next = [...metrics];
                next[i] = { ...next[i], label: v };
                set({ metrics: next });
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => set({ metrics: metrics.filter((_, j) => j !== i) })}
            className="pb-2.5 text-xs text-red-600 hover:underline dark:text-red-400"
          >
            Remove
          </button>
        </div>
      ))}
      {metrics.length < 3 && (
        <button
          type="button"
          onClick={() =>
            set({ metrics: [...metrics, { value: "", label: "" }] })
          }
          className="rounded-[6px] border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-border-strong"
        >
          + Add metric
        </button>
      )}

      <SectionLabel>Sections</SectionLabel>
      {sections.map((section, i) => (
        <div
          key={i}
          className="space-y-3 rounded-[6px] border border-border p-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <TextField
                label="Heading"
                value={section.heading}
                onChange={(v) => {
                  const next = [...sections];
                  next[i] = { ...next[i], heading: v };
                  set({ sections: next });
                }}
              />
            </div>
            <div className="flex gap-1 pt-6">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => {
                  const next = [...sections];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  set({ sections: next });
                }}
                className="rounded px-2 py-2 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                aria-label="Move section up"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === sections.length - 1}
                onClick={() => {
                  const next = [...sections];
                  [next[i], next[i + 1]] = [next[i + 1], next[i]];
                  set({ sections: next });
                }}
                className="rounded px-2 py-2 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
                aria-label="Move section down"
              >
                ↓
              </button>
            </div>
          </div>
          <RichTextEditor
            value={section.body}
            minHeight={200}
            onChange={(md) => {
              const next = [...sections];
              next[i] = { ...next[i], body: md };
              set({ sections: next });
            }}
          />
          <button
            type="button"
            onClick={() =>
              set({ sections: sections.filter((_, j) => j !== i) })
            }
            className="text-xs text-red-600 hover:underline dark:text-red-400"
          >
            Remove section
          </button>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_SECTIONS.filter((s) => !used.has(s.heading)).map((s) => (
          <button
            key={s.heading}
            type="button"
            onClick={() => addSection(s.heading)}
            title={
              s.tier === "core"
                ? "Core — worth having on every project"
                : "Depth — for the two or three flagship projects"
            }
            className={`rounded-[6px] border border-dashed px-3 py-2 text-sm hover:border-border-strong ${
              s.tier === "core"
                ? "border-border-strong text-muted-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            + {s.heading}
          </button>
        ))}
        <button
          type="button"
          onClick={() => addSection("")}
          className="rounded-[6px] border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-border-strong"
        >
          + Custom section
        </button>
      </div>
    </div>
  );
}
