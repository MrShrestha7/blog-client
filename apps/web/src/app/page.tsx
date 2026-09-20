import { client } from "@repo/db/client";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = params.page ? 2 : 4;
  const totalPosts = await client.db.post.count({ where: { active: true } });
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { _count: { select: { Likes: true } } },
  });

  const mappedPosts = posts.map((post) => ({
    ...post,
    date: new Date(post.date),
    likes: post._count.Likes,
  }));
  const hasNextPage = page * pageSize < totalPosts;
  const [leadPost, ...popularPosts] = mappedPosts;
  const topics = [...new Set(mappedPosts.map((post) => post.category))];

  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>fs</span>
          <span>field notes</span>
        </Link>
        <nav aria-label="Blog topics" className={styles.topicNav}>
          {topics.map((topic) => (
            <Link key={topic} href={`/category/${topic.toLowerCase().replace(/\s+/g, "-")}`}>
              {topic}
            </Link>
          ))}
        </nav>
        <div className={styles.pageNav}>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/search" aria-label="Search posts" className={styles.searchButton}>Search</Link>
        </div>
      </header>

      <section className={styles.intro}>
        <p>Independent notes for people building on the web</p>
        <h1>Make better digital work, one practical story at a time.</h1>
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
              <div className={styles.metadata}>
                <span>{leadPost.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
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
                  <time dateTime={post.date.toISOString()}>{post.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                </div>
              </article>
            ))}
          </div>
        </aside>
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
          <p className={styles.kicker}>Stay in the loop</p>
          <h2>New practical notes, without the noise.</h2>
        </div>
        <Link href="/search" className={styles.updatesLink}>Browse latest stories</Link>
      </section>

      <nav aria-label="Post pages" data-test-id="pagination" className={styles.pagination}>
        <Link aria-disabled={page === 1} className={page === 1 ? styles.disabled : ""} href={page > 1 ? `/?page=${page - 1}` : "/"}>Previous</Link>
        <span>Page {page}</span>
        <Link aria-disabled={!hasNextPage} className={!hasNextPage ? styles.disabled : ""} href={hasNextPage ? `/?page=${page + 1}` : `/?page=${page}`}>Next</Link>
      </nav>
    </main>
  );
}
