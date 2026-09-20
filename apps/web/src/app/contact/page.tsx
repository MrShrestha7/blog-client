import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";
import styles from "../info.module.css";

export default function ContactPage() {
  return (
    <AppLayout>
      <article className={styles.page}>
        <p className={styles.eyebrow}>Contact</p>
        <h1>Have a story, question, or useful idea?</h1>
        <p>Field Notes is built around practical conversations. Share a topic you would like explored or a perspective that could help other readers.</p>
        <a className={styles.link} href="mailto:hello@fieldnotes.example">hello@fieldnotes.example</a>
        <p className={styles.small}>For post management, use the admin dashboard.</p>
        <Link href="/" className={styles.secondaryLink}>Back to the archive</Link>
      </article>
    </AppLayout>
  );
}