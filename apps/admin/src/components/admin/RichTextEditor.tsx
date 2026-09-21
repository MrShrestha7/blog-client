"use client";

import "quill/dist/quill.snow.css";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { marked } from "marked";
import type Quill from "quill";

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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;
  useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement);

  useEffect(() => {
    let isMounted = true;

    void import("quill").then(({ default: QuillConstructor }) => {
      if (!isMounted || !editorRef.current || quillRef.current) return;

      const quill = new QuillConstructor(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            ["clean"],
          ],
        },
        placeholder: "Write your post content...",
      });

      quill.root.id = "content";
      quill.root.setAttribute("aria-label", "Content");
      quill.root.innerHTML = toEditorHtml(value);
      quill.on("text-change", (_delta, _oldDelta, source) => {
        if (source !== "user") return;

        const nextValue = quill.getText().trim() ? quill.root.innerHTML : "";
        onChangeRef.current(nextValue);
      });
      quillRef.current = quill;
    });

    return () => {
      isMounted = false;
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || document.activeElement === quill.root) return;

    const nextHtml = toEditorHtml(value);
    if (quill.root.innerHTML !== nextHtml) {
      quill.root.innerHTML = nextHtml;
    }
  }, [value]);

  return (
    <div ref={wrapperRef} data-test-id="rich-text-editor" className="overflow-hidden rounded-md border border-slate-300 dark:border-slate-600">
      <div ref={editorRef} className="min-h-[220px] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100" />
    </div>
  );
});
