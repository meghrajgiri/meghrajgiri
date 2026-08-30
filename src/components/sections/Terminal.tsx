"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";

/**
 * An interactive shell, used as a signature element rather than as the site itself.
 *
 * Terminal portfolios usually hide everything behind commands, which means a visitor
 * who does not type sees nothing. Here the work stays visible and image-led further
 * down the page; this panel is something to play with, not the only way through. Every
 * answer is generated from the live site config, so it can never drift from the rest
 * of the page.
 */

type Line = { kind: "in" | "out" | "link"; text: string; href?: string };

const PROMPT = "~";

export function Terminal() {
  const config = useSiteConfig();
  const { personal, projects, skills, contact } = config;

  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [booted, setBooted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const published = (projects?.projects ?? []).filter((p) => p.published !== false);

  const run = useCallback(
    (raw: string): Line[] => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return [];

      switch (cmd) {
        case "help":
          return [
            { kind: "out", text: "whoami      who I am and what I build" },
            { kind: "out", text: "projects    everything I have shipped" },
            { kind: "out", text: "stack       tools I work with" },
            { kind: "out", text: "contact     how to reach me" },
            { kind: "out", text: "clear       clear the screen" },
          ];
        case "whoami":
          return ([
            { kind: "out", text: `${personal?.name ?? "Meghraj Giri"} — ${personal?.role ?? "Full stack developer"}` },
            { kind: "out", text: personal?.tagline ?? "" },
            { kind: "out", text: `based in ${personal?.location ?? "Nepal"}, working worldwide` },
          ] as Line[]).filter((l) => l.text);
        case "projects":
          return [
            { kind: "out", text: `${published.length} shipped:` },
            ...published.map((p) => ({
              kind: "link" as const,
              text: `${p.slug} — ${p.category} · ${p.year}`,
              href: `/projects/${p.slug}`,
            })),
          ];
        case "stack":
          return [
            {
              kind: "out",
              text:
                (skills?.categories ?? [])
                  .flatMap((c) => c.skills.map((s) => s.name))
                  .slice(0, 14)
                  .join(" · ") || "React · React Native · Next.js · TypeScript · Supabase",
            },
          ];
        case "contact":
          return ([
            { kind: "link", text: contact?.contactInfo?.email ?? "", href: `mailto:${contact?.contactInfo?.email}` },
            { kind: "out", text: contact?.availability?.status ?? "" },
            { kind: "out", text: contact?.availability?.responseTime ?? "" },
          ] as Line[]).filter((l) => l.text);
        case "clear":
          return [];
        default:
          return [{ kind: "out", text: `command not found: ${cmd} — try 'help'` }];
      }
    },
    [personal, published, skills, contact],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = value;
    setValue("");
    if (entry.trim().toLowerCase() === "clear") {
      setLines([]);
      return;
    }
    setLines((prev) => [...prev, { kind: "in", text: entry }, ...run(entry)]);
  };

  // Reveal the intro once, then hand over. Skipped entirely when the visitor has asked
  // for reduced motion — a typing effect they cannot stop is exactly what that setting
  // is for.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setBooted(true);
      return;
    }
    const t = setTimeout(() => setBooted(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  return (
    <div
      className="nb relative h-full overflow-hidden bg-[#1D1D1C]"
      style={{ colorScheme: "dark" }}
    >
      {/*
        No ambient glow. It tinted with `var(--brand)`, which meant the panel changed
        character with the palette — and a luminous accent washed it out entirely.
        Neubrutalism specifies no gradients, so a flat panel is also the more correct
        reading of the style.
      */}
      {/* title bar */}
      <div className="relative flex items-center gap-2 border-b border-white/10 px-4 py-2.5 sm:py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-2 truncate font-mono text-[10px] text-white/45 sm:ml-3 sm:text-[11px]">
          {(personal?.name ?? "meghraj").split(" ")[0].toLowerCase()}@portfolio · zsh
        </span>
      </div>

      <div
        ref={scrollRef}
        className="relative h-[236px] overflow-y-auto px-4 py-4 font-mono text-[12px] leading-[1.8] sm:h-[262px] sm:px-5 sm:text-[13px]"
        onClick={() => inputRef.current?.focus()}
      >
        <p className="text-white/90">
          {personal?.name ?? "Meghraj Giri"} <span className="text-white/30">·</span>{" "}
          <span style={{ color: "var(--brand)" }}>interactive shell</span>
        </p>
        <p className="text-white/40">
          type &lsquo;help&rsquo; to get started &mdash; or try{" "}
          <button
            type="button"
            onClick={() => setLines((prev) => [...prev, { kind: "in", text: "projects" }, ...run("projects")])}
            className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/80"
          >
            projects
          </button>
        </p>

        {lines.map((line, i) =>
          line.kind === "in" ? (
            <p key={i} className="mt-1 text-white/80">
              <span className="text-white/30">{PROMPT}</span> {line.text}
            </p>
          ) : line.kind === "link" && line.href ? (
            <p key={i} className="break-words">
              <Link
                href={line.href}
                className="underline decoration-white/20 underline-offset-4 hover:decoration-current"
                style={{ color: "var(--brand)" }}
              >
                {line.text}
              </Link>
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap text-white/55">
              {line.text}
            </p>
          ),
        )}

        {booted && (
          <form onSubmit={submit} className="mt-1 flex items-center gap-2">
            <label htmlFor="terminal-input" className="sr-only">
              Type a command
            </label>
            <span className="text-white/30">{PROMPT}</span>
            <input
              id="terminal-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="type 'help'"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[12px] text-white/90 placeholder:text-white/25 focus:outline-none focus:ring-0 sm:text-[13px]"
            />
          </form>
        )}
      </div>
    </div>
  );
}
