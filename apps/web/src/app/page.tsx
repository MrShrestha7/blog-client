import { client } from "@repo/db/client";
import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { CategoryList } from "@/components/Menu/CategoryList";
import { HistoryList } from "@/components/Menu/HistoryList";
import { TagList } from "@/components/Menu/TagList";
import { TopMenu } from "@/components/Layout/TopMenu";
import styles from "./page.module.css";

export default async function Home() {
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { _count: { select: { Likes: true } } },
  });

  const mappedPosts = posts.map((post) => ({
    ...post,
    date: new Date(post.date),
    likes: post._count.Likes,
  }));
  const visiblePosts = [...mappedPosts].sort((first, second) => first.id - second.id);
  const [leadPost, ...popularPosts] = visiblePosts;
  const topics = [...new Set(mappedPosts.map((post) => post.category))];

  return (
    <main className={styles.page}>
      <TopMenu />

      <section
        className={styles.intro}
        style={{ backgroundImage: "linear-gradient(90deg, rgba(13, 31, 48, .78), rgba(13, 31, 48, .18)), url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=85)" }}
      >
        <p className={styles.welcome}>Welcome to</p>
        <h1>Field Notes</h1>
        <p className={styles.introDetail}>Interested in technology? Write and share your digital experiences.</p>
        <Link href="/search" className={styles.heroButton}>Read blog</Link>
      </section>

      <section className={styles.content}>
        {leadPost ? (
          <article className={styles.leadStory} data-test-id={`blog-post-${leadPost.id}`}>
            <Link href={`/post/${leadPost.urlId}`} className={styles.leadImageLink} aria-label={leadPost.title}>
              <img src={leadPost.imageUrl} alt={leadPost.title} className={styles.leadImage} />
            </Link>
            <div className={styles.storyBody}>
              <p className={styles.kicker}>{leadPost.category}</p>
              <h1>
                <Link href={`/post/${leadPost.urlId}`}>{leadPost.title}</Link>
              </h1>
              <p className={styles.description}>{leadPost.description}</p>
              <p>{leadPost.tags.split(",").map((tag) => `#${tag.trim()}`).join(" ")}</p>
              <div className={styles.metadata}>
                <span>{leadPost.date.toLocaleDateString("en-GB", { month: "short", day: "2-digit", year: "numeric" })}</span>
                <span>{leadPost.views} views</span>
                <span>{leadPost.likes} likes</span>
              </div>
            </div>
          </article>
        ) : (
          <p className={styles.emptyState}>No published posts yet.</p>
        )}

        <aside className={styles.popular} aria-labelledby="popular-heading">
          <h2 id="popular-heading">Popular of All-Time</h2>
          <div className={styles.popularList}>
            {popularPosts.map((post) => (
              <article key={post.id} className={styles.popularItem} data-test-id={`blog-post-${post.id}`}>
                <Link href={`/post/${post.urlId}`} aria-label={post.title}>
                  <img src={post.imageUrl} alt="" className={styles.thumbnail} />
                </Link>
                <div>
                  <p className={styles.itemKicker}>{post.category}</p>
                  <h3><Link href={`/post/${post.urlId}`}>{post.title}</Link></h3>
                  <p>{post.tags.split(",").map((tag) => `#${tag.trim()}`).join(" ")}</p>
                  <time dateTime={post.date.toISOString()}>{post.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                  <p>{post.views} views</p>
                  <p>{post.likes} likes</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section aria-label="Browse blog archive" style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", maxWidth: 1180, margin: "0 auto", padding: "32px 42px" }}>
        <CategoryList posts={mappedPosts} />
        <HistoryList posts={mappedPosts} />
        <TagList posts={mappedPosts} />
      </section>

      <section className={styles.discovery}>
        <div>
          <p className={styles.kicker}>Explore the archive</p>
          <h2>Find a topic to follow</h2>
        </div>
        <div className={styles.topicGrid}>
          {topics.map((topic) => (
            <Link key={topic} href={`/category/${topic.toLowerCase().replace(/\s+/g, "-")}`}>
              <span>{topic}</span>
              <span aria-hidden="true">Explore</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.updates}>
        <div>
          <h2>Get every new post<br />delivered to your inbox.</h2>
        </div>
        <NewsletterSignup />
        <Link href="/search" className={styles.updatesBrowse}>Browse latest stories</Link>
      </section>
    </main>
  );
}
