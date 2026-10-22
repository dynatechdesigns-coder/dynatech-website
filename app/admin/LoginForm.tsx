"use client";

import { useState } from "react";

// Password form shared by /admin/login and the slide-over panel on the homepage.
// The password is only ever sent to /api/admin/login, which sets the httpOnly cookie.
export default function LoginForm({ onSuccess, autoFocus = true }: { onSuccess: () => void; autoFocus?: boolean }) {
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
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "contents" }}>
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
        autoFocus={autoFocus}
      />
      {error && <p className="a-error">{error}</p>}
      <button className="a-btn a-btn-primary" type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
