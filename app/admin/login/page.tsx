"use client";

import LoginForm from "../LoginForm";
import { Wordmark } from "@/app/components/Logo";

export default function LoginPage() {
  return (
    <main className="login">
      <div className="login-card">
        <Wordmark size={34} />
        <h1>Admin sign in</h1>
        <p className="muted">Manage your portfolio content and messages.</p>
        <LoginForm onSuccess={() => (window.location.href = "/admin")} />
        <a className="muted small" href="/">
          ← Back to website
        </a>
      </div>
    </main>
  );
}
