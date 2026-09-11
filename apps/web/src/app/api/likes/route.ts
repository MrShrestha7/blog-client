import { client } from "@repo/db/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return headersList.get("x-real-ip") ?? "127.0.0.1";
}

async function getLikesCount(postId: number) {
  return client.db.like.count({
    where: { postId },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { postId?: number | string };
  const postId = Number(body.postId);

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const post = await client.db.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const headerList = await headers();
  const userIP = getClientIp(headerList);

  const existingLike = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId,
        userIP,
      },
    },
  });

  if (!existingLike) {
    await client.db.like.create({
      data: {
        postId,
        userIP,
      },
    });
  }

  return NextResponse.json({
    liked: true,
    likes: await getLikesCount(postId),
  });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { postId?: number | string };
  const postId = Number(body.postId);

  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const headerList = await headers();
  const userIP = getClientIp(headerList);

  await client.db.like.deleteMany({
    where: {
      postId,
      userIP,
    },
  });

  return NextResponse.json({
    liked: false,
    likes: await getLikesCount(postId),
  });
}
