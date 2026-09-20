import Link from "next/link";
import { AppLayout } from "@/components/Layout/AppLayout";
import styles from "../info.module.css";

export default function AboutPage() {
  return (
    <AppLayout>
      <article className={styles.page}>
        <p className={styles.eyebrow}>About Field Notes</p>
        <h1>Practical writing for people who build on the web.</h1>
        <p>Field Notes is an independent collection of clear, useful perspectives on engineering, design, and the everyday decisions behind digital products.</p>
        <p>Each post begins with a real question worth exploring, then keeps the answer direct enough to use in your next project.</p>
        <Link href="/" className={styles.link}>Read the latest stories</Link>
      </article>
    </AppLayout>
  );
}