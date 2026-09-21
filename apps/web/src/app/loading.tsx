import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.page} aria-busy="true" aria-label="Loading posts">
      <header className={styles.masthead}>
        <span className={styles.brand} />
        <span className={styles.topicNav} />
        <span className={styles.pageNav} />
      </header>
      <section className={styles.intro}>
        <span className={styles.introLine} />
        <span className={styles.introTitle} />
      </section>
      <section className={styles.content}>
        <div className={styles.leadStory}>
          <span className={styles.leadImage} />
          <div className={styles.storyBody}>
            <span className={styles.kicker} />
            <span className={styles.storyTitle} />
            <span className={styles.description} />
            <span className={styles.metadata} />
          </div>
        </div>
        <aside className={styles.popular}>
          <span className={styles.popularHeading} />
          <span className={styles.popularItem} />
          <span className={styles.popularItem} />
        </aside>
      </section>
      <nav className={styles.pagination} aria-label="Loading post pages">
        <span />
        <span className={styles.pageNumber} />
        <span />
      </nav>
    </main>
  );
}
