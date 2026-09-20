"use client";

import { marked } from "marked";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "../../utils/admin-data";
import { createPost, updatePost, type AdminPost } from "../../utils/posts-actions";
import { RichTextEditor } from "./RichTextEditor";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  content: "",
  imageUrl: "",
  tags: "",
};

type Mode = "create" | "edit";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function AdminPostForm({ mode, initialPost }: { mode: Mode; initialPost?: AdminPost }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const initialValues = useMemo(
    () => ({
      title: initialPost?.title ?? emptyForm.title,
      category: initialPost?.category ?? emptyForm.category,
      description: initialPost?.description ?? emptyForm.description,
      content: initialPost?.content ?? emptyForm.content,
      imageUrl: initialPost?.imageUrl ?? emptyForm.imageUrl,
      tags: initialPost?.tags ?? emptyForm.tags,
    }),
    [initialPost],
  );

  const [form, setForm] = useState(initialValues);
  const formRef = useRef(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const previewHtml = useMemo(() => marked.parse(form.content || ""), [form.content]);

  const handleFieldChange = (field: keyof typeof emptyForm, value: string) => {
    const nextForm = { ...formRef.current, [field]: value };
    formRef.current = nextForm;
    setForm(nextForm);
    setErrors((current) => ({ ...current, [field]: "" }));
    setGeneralError("");
  };

  const validate = () => {
    const currentForm = formRef.current;
    const nextErrors: Record<string, string> = {};

    if (!currentForm.title.trim()) nextErrors.title = "Title is required";
    if (!currentForm.description.trim()) nextErrors.description = "Description is required";
    else if (currentForm.description.length > 200)
      nextErrors.description = "Description is too long. Maximum is 200 characters";
    if (!currentForm.content.trim()) nextErrors.content = "Content is required";
    if (!currentForm.imageUrl.trim()) nextErrors.imageUrl = "Image URL is required";
    else if (!isValidUrl(currentForm.imageUrl)) nextErrors.imageUrl = "This is not a valid URL";

    const tagList = currentForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (tagList.length === 0) nextErrors.tags = "At least one tag is required";

    return nextErrors;
  };

  const handleSave = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccessMessage("");
      setGeneralError("Please fix the errors before saving");
      return;
    }

    const currentForm = formRef.current;
    const postInput = {
      title: currentForm.title,
      category: currentForm.category,
      description: currentForm.description,
      content: currentForm.content,
      imageUrl: currentForm.imageUrl,
      tags: currentForm.tags,
      urlId: mode === "edit" && initialPost ? initialPost.urlId : slugify(currentForm.title),
    };

    if (mode === "edit" && initialPost) {
      await updatePost(initialPost.id, postInput);
    } else {
      await createPost({ ...postInput, urlId: postInput.urlId || `post-${Date.now()}` });
    }

    setErrors({});
    setGeneralError("");
    setSuccessMessage("Post updated successfully");
    router.refresh();
  };

  const handlePreviewToggle = () => {
    if (!showPreview && textareaRef.current) {
      // Saving selection before opening preview
      selectionRef.current = {
        start: textareaRef.current.selectionStart ?? 0,
        end: textareaRef.current.selectionEnd ?? 0,
      };
    }
    setShowPreview((current) => !current);
  };

  // Restore selection when closing preview
  useEffect(() => {
    if (!showPreview && textareaRef.current) {
      const { start, end } = selectionRef.current;
      // Use a microtask to ensure DOM has updated
      Promise.resolve().then(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start, end);
        }
      });
    }
  }, [showPreview]);


  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: 40, marginBottom: 24, fontWeight: 800 }}>Post {mode === "edit" ? "Edit" : "Create"}</h1>

      {generalError ? (
        <p role="alert" style={{ color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", padding: 12, borderRadius: 8 }}>
          {generalError}
        </p>
      ) : null}

      {successMessage ? (
        <p style={{ color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: 12, borderRadius: 8 }}>
          {successMessage}
        </p>
      ) : null}

      <div style={{ display: "grid", gap: 18 }}>
        <label htmlFor="title" style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Title
          <input
            id="title"
            value={form.title}
            onChange={(event) => handleFieldChange("title", event.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px" }}
          />
          {errors.title ? <span style={{ color: "#b91c1c" }}>{errors.title}</span> : null}
        </label>

        <label htmlFor="category" style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Category
          <input
            id="category"
            value={form.category}
            onChange={(event) => handleFieldChange("category", event.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px" }}
          />
        </label>

        <div>
          <label htmlFor="description" style={{ display: "grid", gap: 6, fontWeight: 600 }}>
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => handleFieldChange("description", event.target.value)}
            style={{ width: "100%", minHeight: 120, border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px" }}
          />
          {errors.description ? <p style={{ color: "#b91c1c", marginTop: 8 }}>{errors.description}</p> : null}
        </div>

        <div>
          <label htmlFor="content" style={{ display: "grid", gap: 6, fontWeight: 600 }}>
            Content
          </label>
          {showPreview ? (
            <div
              data-test-id="content-preview"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{ minHeight: 220, border: "1px solid #d1d5db", borderRadius: 8, padding: 12 }}
            />
          ) : (
            <RichTextEditor
              ref={textareaRef}
              value={form.content}
              onChange={(value) => handleFieldChange("content", value)}
            />
          )}

          <button type="button" onClick={handlePreviewToggle} style={{ marginTop: 10 }}>
            {showPreview ? "Close Preview" : "Preview"}
          </button>
          {errors.content ? <p style={{ color: "#b91c1c", marginTop: 8 }}>{errors.content}</p> : null}
        </div>

        <label htmlFor="tags" style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Tags
          <input
            id="tags"
            value={form.tags}
            onChange={(event) => handleFieldChange("tags", event.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px" }}
          />
          {errors.tags ? <span style={{ color: "#b91c1c" }}>{errors.tags}</span> : null}
        </label>

        <label htmlFor="imageUrl" style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Image URL
          <input
            id="imageUrl"
            value={form.imageUrl}
            onChange={(event) => handleFieldChange("imageUrl", event.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px" }}
          />
          {errors.imageUrl ? <span style={{ color: "#b91c1c" }}>{errors.imageUrl}</span> : null}
        </label>

        <div>
          <img
            data-test-id="image-preview"
            src={form.imageUrl || "https://placehold.co/600x400?text=Image+Preview"}
            alt="Preview"
            style={{ maxWidth: 280, width: "100%", borderRadius: 12, border: "1px solid #d1d5db" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button type="button" onClick={handleSave} style={{ background: "#111827", color: "white", border: "none", borderRadius: 8, padding: "12px 18px", cursor: "pointer", fontWeight: 700 }}>
            Save
          </button>
          <button type="button" onClick={() => router.push("/")} style={{ background: "#e5e7eb", color: "#111827", border: "none", borderRadius: 8, padding: "12px 18px", cursor: "pointer", fontWeight: 700 }}>
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
