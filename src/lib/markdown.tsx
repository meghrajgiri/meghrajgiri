import type { ReactNode } from "react";

/**
 * A small server-side Markdown renderer for case-study and article prose.
 *
 * Deliberately not a dependency: this runs in a server component, so a parser like
 * `react-markdown` would either ship to the client or pull remark's whole pipeline in
 * for the handful of constructs long-form prose actually uses. The supported set is
 * exactly what the content briefs call for — headings, paragraphs, lists, blockquotes,
 * fenced code, and inline emphasis, code and links.
 *
 * Input comes from the CMS, which is service-role protected, but nothing here trusts
 * it: text is emitted as React children (escaped by React) and never as
 * `dangerouslySetInnerHTML`, so a stray `<script>` in the copy renders as visible text
 * rather than executing.
 */

type Inline = { text: string; bold?: boolean; italic?: boolean; code?: boolean; href?: string };

/** Split a line into styled runs. Order matters: code wins, so `**x**` inside it stays literal. */
function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  // code | bold | italic | link
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ text: src.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith("`")) out.push({ text: tok.slice(1, -1), code: true });
    else if (tok.startsWith("**")) out.push({ text: tok.slice(2, -2), bold: true });
    else if (tok.startsWith("*")) out.push({ text: tok.slice(1, -1), italic: true });
    else {
      const cut = tok.indexOf("](");
      out.push({ text: tok.slice(1, cut), href: tok.slice(cut + 2, -1) });
    }
    last = m.index + tok.length;
  }
  if (last < src.length) out.push({ text: src.slice(last) });
  return out;
}

function renderInline(src: string, keyPrefix: string): ReactNode[] {
  return parseInline(src).map((run, i) => {
    const key = `${keyPrefix}-${i}`;
    if (run.href) {
      // Only http(s) and same-site paths. A `javascript:` href in CMS copy would
      // otherwise become a live link.
      const safe = /^(https?:\/\/|\/|#)/.test(run.href) ? run.href : "#";
      const external = safe.startsWith("http");
      return (
        <a
          key={key}
          href={safe}
          className="underline underline-offset-4 transition-colors hover:text-primary"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {run.text}
        </a>
      );
    }
    if (run.code)
      return (
        <code key={key} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
          {run.text}
        </code>
      );
    if (run.bold) return <strong key={key} className="font-semibold text-foreground">{run.text}</strong>;
    if (run.italic) return <em key={key}>{run.text}</em>;
    return <span key={key}>{run.text}</span>;
  });
}

/** Render a Markdown string as block-level React nodes. */
export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code — held verbatim, no inline parsing
    if (line.startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(
        <pre
          key={`c${i}`}
          className="my-6 overflow-x-auto rounded-[6px] border border-border bg-muted p-5 font-mono text-sm leading-relaxed"
        >
          <code>{body.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = renderInline(heading[2], `h${i}`);
      blocks.push(
        level === 2 ? (
          <h2 key={`h${i}`} className="mt-12 text-2xl font-bold md:text-3xl">{text}</h2>
        ) : level === 3 ? (
          <h3 key={`h${i}`} className="mt-8 text-xl font-semibold">{text}</h3>
        ) : (
          <h4 key={`h${i}`} className="mt-6 text-lg font-semibold">{text}</h4>
        ),
      );
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      const body: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) body.push(lines[i++].slice(2));
      blocks.push(
        <blockquote
          key={`q${i}`}
          className="my-6 border-l border-primary pl-6 text-lg italic leading-relaxed"
        >
          {renderInline(body.join(" "), `q${i}`)}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ""));
      blocks.push(
        <ul key={`u${i}`} className="my-5 list-disc space-y-2 pl-6 text-muted-foreground">
          {items.map((it, n) => <li key={n}>{renderInline(it, `u${i}-${n}`)}</li>)}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, ""));
      blocks.push(
        <ol key={`o${i}`} className="my-5 list-decimal space-y-2 pl-6 text-muted-foreground">
          {items.map((it, n) => <li key={n}>{renderInline(it, `o${i}-${n}`)}</li>)}
        </ol>,
      );
      continue;
    }

    // paragraph — consume until a blank line or the start of another block
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("> ") &&
      !/^(#{2,4})\s/.test(lines[i]) &&
      !/^([-*]|\d+\.)\s/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    blocks.push(
      <p key={`p${i}`} className="my-5 leading-relaxed text-muted-foreground">
        {renderInline(para.join(" "), `p${i}`)}
      </p>,
    );
  }

  return <>{blocks}</>;
}
