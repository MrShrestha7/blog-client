"use server";

import { client } from "@repo/db/client";

export type AdminPost = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

type PostWithLikeCount = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  tags: string;
  active: boolean;
  _count: { Likes: number };
};

function mapPost(post: PostWithLikeCount): AdminPost {
  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: new Date(post.date),
    category: post.category,
    views: post.views,
    likes: post._count.Likes,
    tags: post.tags,
    active: post.active,
  };
}

export async function getPosts(): Promise<AdminPost[]> {
  const posts = await client.db.post.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { Likes: true } } },
  });
  return posts.map(mapPost);
}

export async function getPostByUrlId(urlId: string): Promise<AdminPost | undefined> {
  const post = await client.db.post.findFirst({
    where: { urlId },
    include: { _count: { select: { Likes: true } } },
  });
  return post ? mapPost(post) : undefined;
}

export async function toggleActive(id: number): Promise<AdminPost> {
  const post = await client.db.post.findUniqueOrThrow({ where: { id } });
  const updated = await client.db.post.update({
    where: { id },
    data: { active: !post.active },
    include: { _count: { select: { Likes: true } } },
  });
  return mapPost(updated);
}

export type PostInput = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  urlId: string;
};

export async function createPost(data: PostInput): Promise<AdminPost> {
  const created = await client.db.post.create({
    data: {
      title: data.title,
      urlId: data.urlId,
      category: data.category,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      tags: data.tags,
      active: true,
    },
    include: { _count: { select: { Likes: true } } },
  });
  return mapPost(created);
}

export async function updatePost(id: number, data: PostInput): Promise<AdminPost> {
  const updated = await client.db.post.update({
    where: { id },
    data: {
      title: data.title,
      urlId: data.urlId,
      category: data.category,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      tags: data.tags,
    },
    include: { _count: { select: { Likes: true } } },
  });
  return mapPost(updated);
}
