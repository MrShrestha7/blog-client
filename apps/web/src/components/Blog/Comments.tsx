"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: number;
  parentId: number | null;
  content: string;
  author: string;
  createdAt: string;
};

function CommentItem({
  comment,
  comments,
  replies,
  onReply,
}: {
  comment: Comment;
  comments: Comment[];
  replies: Comment[];
  onReply: (id: number) => void;
}) {
  return (
    <li className="border-l-2 border-slate-200 pl-4">
      <p className="text-sm font-semibold">{comment.author}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-secondary">{comment.content}</p>
      <button type="button" className="mt-2 text-xs underline" onClick={() => onReply(comment.id)}>
        Reply
      </button>
      {replies.length > 0 ? (
        <ul className="mt-4 grid gap-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              comments={comments}
              replies={comments.filter((item) => item.parentId === reply.id)}
              onReply={onReply}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function Comments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadComments() {
    const response = await fetch(`/api/comments?postId=${postId}`);
    if (response.ok) setComments((await response.json()) as Comment[]);
  }

  useEffect(() => {
    void loadComments();
  }, [postId]);

  async function submitComment() {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, parentId: replyTo, content }),
    });
    if (!response.ok) {
      setError("Comment could not be added.");
      return;
    }
    setContent("");
    setReplyTo(null);
    setError("");
    await loadComments();
  }

  const roots = comments.filter((comment) => comment.parentId === null);
  const repliesFor = (id: number) => comments.filter((comment) => comment.parentId === id);

  return (
    <section aria-label="Comments" className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      <div className="mt-4 grid gap-3">
        <label htmlFor="comment-content" className="font-medium">{replyTo ? "Reply to comment" : "Add a comment"}</label>
        <textarea id="comment-content" aria-label="comment-content" value={content} onChange={(event) => setContent(event.target.value)} rows={4} className="rounded-md border border-slate-300 p-3" maxLength={1000} />
        <div className="flex gap-3">
          <button type="button" onClick={() => void submitComment()} disabled={!content.trim()} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Post comment</button>
          {replyTo ? <button type="button" onClick={() => setReplyTo(null)} className="text-sm underline">Cancel reply</button> : null}
        </div>
        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      </div>
      <ul className="mt-8 grid gap-6">
        {roots.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            comments={comments}
            replies={repliesFor(comment.id)}
            onReply={setReplyTo}
          />
        ))}
      </ul>
    </section>
  );
}