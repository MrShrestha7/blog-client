"use client";

import { FormEvent, useState } from "react";
import styles from "./NewsletterSignup.module.css";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="newsletter-email">Email Address</label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        placeholder="Email Address"
        required
        disabled={submitted}
      />
      <button type="submit" disabled={submitted}>
        {submitted ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}
