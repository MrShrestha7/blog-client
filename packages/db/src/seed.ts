import { posts } from "./data.js";
import { client } from "./client.js";

export async function seed() {
  await client.db.comment.deleteMany();
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();

  for (const post of posts) {
    await client.db.post.create({
      data: {
        id: post.id,
        title: post.title,
        urlId: post.urlId,
        description: post.description,
        content: post.content,
        imageUrl: post.imageUrl,
        date: post.date,
        category: post.category,
        tags: post.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .join(","),
        views: post.views,
        active: post.active,
      },
    });

    for (let index = 0; index < post.likes; index += 1) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${index}`,
        },
      });
    }
  }
}