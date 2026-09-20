"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { marked } from "marked";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function toEditorHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value) ? value : (marked.parse(value || "") as string);
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(function RichTextEditor(
  { value, onChange },
  ref,
) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastValueRef = useRef("");

  useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor || lastValueRef.current === value) return;

    editor.innerHTML = toEditorHtml(value);
    lastValueRef.current = value;
  }, [value]);

  const applyFormat = (command: "bold" | "italic" | "insertUnorderedList" | "formatBlock") => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand(command, false, command === "formatBlock" ? "h2" : undefined);
    const nextValue = editor.innerHTML;
    lastValueRef.current = nextValue;
    onChange(nextValue);
  };

  return (
    <div data-test-id="rich-text-editor" className="overflow-hidden rounded-md border border-slate-300 dark:border-slate-600">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-100 p-2 dark:border-slate-600 dark:bg-slate-800">
        <button type="button" aria-label="Bold" title="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("bold")} className="rounded border border-slate-500 bg-white px-2 py-1 font-bold text-slate-900 hover:bg-sky-100 dark:border-slate-400 dark:bg-slate-700 dark:text-white dark:hover:bg-sky-700">B</button>
        <button type="button" aria-label="Italic" title="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("italic")} className="rounded border border-slate-500 bg-white px-2 py-1 italic text-slate-900 hover:bg-sky-100 dark:border-slate-400 dark:bg-slate-700 dark:text-white dark:hover:bg-sky-700">I</button>
        <button type="button" aria-label="Bullet list" title="Bullet list" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("insertUnorderedList")} className="rounded border border-slate-500 bg-white px-2 py-1 text-slate-900 hover:bg-sky-100 dark:border-slate-400 dark:bg-slate-700 dark:text-white dark:hover:bg-sky-700">List</button>
        <button type="button" aria-label="Heading" title="Heading" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat("formatBlock")} className="rounded border border-slate-500 bg-white px-2 py-1 text-slate-900 hover:bg-sky-100 dark:border-slate-400 dark:bg-slate-700 dark:text-white dark:hover:bg-sky-700">H2</button>
      </div>
      <div
        ref={editorRef}
        id="content"
        role="textbox"
        aria-label="Content"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => {
          const nextValue = event.currentTarget.innerHTML;
          lastValueRef.current = nextValue;
          onChange(nextValue);
        }}
        className="min-h-[220px] w-full whitespace-pre-wrap bg-white p-3 text-slate-900 outline-none dark:bg-slate-950 dark:text-slate-100"
      />
    </div>
  );
});
