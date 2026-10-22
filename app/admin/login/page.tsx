"use client";

import { useState } from "react";
import { Wordmark } from "@/app/components/Logo";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") || "");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not sign in.");
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <form className="login-card" onSubmit={onSubmit}>
        <Wordmark size={34} />
        <h1>Admin sign in</h1>
        <p className="muted">Manage your portfolio content and messages.</p>
        <label className="a-label" htmlFor="password">
          Password
        </label>
        <input
          className="a-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
        />
        {error && <p className="a-error">{error}</p>}
        <button className="a-btn a-btn-primary" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a className="muted small" href="/">
          ← Back to website
        </a>
      </form>
    </main>
  );
}
