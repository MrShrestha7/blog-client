import { posts } from "./data";
import { client } from "./client";

export async function seed() {
  // Seed the database with blog posts and their likes
  console.log("🌱 Seeding data");
  
  // Clear existing data to ensure clean state
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();
  
  // Insert each post from the data array
  for (const post of posts) {
    await client.db.post.create({
      data: {
        // Core post information
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
          .map((p) => p.trim())
          .join(","),
        views: post.views,
        active: post.active,
      },
    });
    
    // Create likes for each post (using IP addresses as user identifiers)
    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
  
  console.log("✅ Seeding completed");
}
