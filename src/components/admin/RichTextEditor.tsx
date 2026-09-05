"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useEffect } from "react";

/**
 * WYSIWYG editing that stores Markdown.
 *
 * The storage format is the point. TipTap's native format is HTML, and putting HTML in
 * the CMS would mean rendering it with `dangerouslySetInnerHTML` on the public site —
 * giving up the guarantee `src/lib/markdown.tsx` was written to provide, that a stray
 * `<script>` in the copy renders as visible text rather than executing. Serialising to
 * Markdown keeps the safe renderer, keeps article bodies diffable, and keeps the
 * content portable if this ever moves back to files.
 *
 * The toolbar is deliberately small: the public renderer supports headings,
 * paragraphs, lists, blockquotes, fenced code and inline emphasis/code/links, so
 * offering a control the site cannot render would be a trap.
 */

/**
 * `tiptap-markdown` attaches its serialiser to `editor.storage.markdown` at runtime
 * but does not augment TipTap's `Storage` interface, so the property is invisible to
 * TypeScript. Narrowed in one place rather than casting at every call site.
 */
function getMarkdown(editor: Editor): string {
  const storage = editor.storage as unknown as {
    markdown?: { getMarkdown: () => string };
  };
  return storage.markdown?.getMarkdown() ?? "";
}

function Button({
  onClick,
  active,
  label,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const link = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (empty to remove)", previous ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-gray-800 dark:bg-gray-900">
      <Button
        label="H2"
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <Button
        label="H3"
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <span className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />
      <Button
        label="B"
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Button
        label="I"
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Button
        label="Code"
        title="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <Button label="Link" title="Add or edit a link" onClick={link} />
      <span className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />
      <Button
        label="• List"
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Button
        label="1. List"
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <Button
        label="Quote"
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <Button
        label="{ }"
        title="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  minHeight = 320,
}: {
  value: string;
  onChange: (markdown: string) => void;
  minHeight?: number;
}) {
  const editor = useEditor({
    // Server-rendering a contenteditable produces a hydration mismatch, and the CMS
    // has no reason to be server-rendered at all.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Markdown.configure({ html: false, linkify: false, breaks: false }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none px-4 py-3 outline-none min-h-[inherit]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(getMarkdown(editor));
    },
  });

  // Only when the incoming value diverges from what the editor already holds —
  // otherwise every keystroke would round-trip through the parent and reset the
  // caret to the top of the document.
  useEffect(() => {
    if (!editor) return;
    const current = getMarkdown(editor);
    if (value !== current) {
      editor.commands.setContent(value ?? "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className="animate-pulse rounded-lg bg-gray-100 dark:bg-gray-900"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
      <Toolbar editor={editor} />
      <div style={{ minHeight }} className="bg-white dark:bg-gray-950">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
