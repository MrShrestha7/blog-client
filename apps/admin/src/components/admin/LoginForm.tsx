"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Invalid password");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Unable to sign in right now");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f7f7f7" }}>
      <section style={{ width: "min(420px, 90vw)", background: "white", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: 32 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Admin Login</h1>
        <p style={{ marginBottom: 24, color: "#4b5563" }}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 12 }}>
            <label htmlFor="password" style={{ display: "grid", gap: 6, fontWeight: 600 }}>
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 16 }}
              />
            </label>

            {error ? (
              <p role="alert" style={{ color: "#b91c1c", margin: 0 }}>
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#0f172a",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
