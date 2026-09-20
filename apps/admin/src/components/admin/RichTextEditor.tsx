"use client";

import { forwardRef, useRef } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(function RichTextEditor(
  { value, onChange },
  ref,
) {
  const localRef = useRef<HTMLTextAreaElement | null>(null);

  const textareaRef = ref ?? localRef;

  const applyFormat = (prefix: string, suffix = prefix) => {
    const textarea = textareaRef && "current" in textareaRef ? textareaRef.current : null;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const selected = textarea.value.slice(start, end) || "text";
    const nextValue = `${textarea.value.slice(0, start)}${prefix}${selected}${suffix}${textarea.value.slice(end)}`;

    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + selected.length;
      textarea.setSelectionRange(newStart, newEnd);
    });
  };

  return (
    <div data-test-id="rich-text-editor" className="overflow-hidden rounded-md border border-slate-300">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" aria-label="Bold" onClick={() => applyFormat("<strong>", "</strong>")} className="rounded border px-2 py-1 font-bold">B</button>
        <button type="button" aria-label="Italic" onClick={() => applyFormat("<em>", "</em>")} className="rounded border px-2 py-1 italic">I</button>
        <button type="button" aria-label="Bullet list" onClick={() => applyFormat("<ul><li>", "</li></ul>")} className="rounded border px-2 py-1">List</button>
        <button type="button" aria-label="Heading" onClick={() => applyFormat("<h2>", "</h2>")} className="rounded border px-2 py-1">H2</button>
      </div>

      <textarea
        ref={textareaRef}
        id="content"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Content"
        className="min-h-[220px] w-full resize-y border-0 p-3 outline-none"
        style={{ fontFamily: "inherit" }}
      />
    </div>
  );
});