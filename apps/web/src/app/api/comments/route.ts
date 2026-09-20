import { client } from "@repo/db/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "127.0.0.1";
}

function toComment(comment: {
  id: number;
  postId: number;
  parentId: number | null;
  content: string;
  authorIP: string;
  createdAt: Date;
}) {
  return { ...comment, author: `Reader ${comment.authorIP.slice(-4)}` };
}

export async function GET(request: Request) {
  const postId = Number(new URL(request.url).searchParams.get("postId"));
  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const comments = await client.db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments.map(toComment));
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    postId?: number | string;
    parentId?: number | string | null;
    content?: string;
  };
  const postId = Number(body.postId);
  const content = body.content?.trim() ?? "";
  const parentId = body.parentId == null ? null : Number(body.parentId);

  if (!Number.isInteger(postId) || !content || content.length > 1000) {
    return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
  }
  if (parentId !== null && !Number.isInteger(parentId)) {
    return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
  }

  const post = await client.db.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  if (parentId !== null) {
    const parent = await client.db.comment.findFirst({ where: { id: parentId, postId } });
    if (!parent) return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
  }

  const comment = await client.db.comment.create({
    data: { postId, parentId, content, authorIP: getClientIp(await headers()) },
  });
  return NextResponse.json(toComment(comment), { status: 201 });
}