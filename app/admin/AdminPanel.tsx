"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/app/components/Logo";
import AdminDashboard from "./AdminDashboard";
import LoginForm from "./LoginForm";
import "./admin.css";

// Slide-over admin shown on top of the homepage. Loaded lazily by AdminLauncher,
// so visitors never download this code unless the button is clicked.
export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "out" | "in">("checking");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { loggedIn?: boolean }) => alive && setState(j.loggedIn ? "in" : "out"))
      .catch(() => alive && setState("out"));
    return () => {
      alive = false;
    };
  }, []);

  // Lock page scroll behind the panel; Esc closes it while signed out
  // (the dashboard handles Esc itself once signed in, to warn about unsaved changes).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(() => {
    if (state === "in") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, onClose]);

  return (
    <div className="admin-overlay" onMouseDown={(e) => e.target === e.currentTarget && state !== "in" && onClose()}>
      <div className="admin admin-panel" role="dialog" aria-modal="true" aria-label="Admin" tabIndex={-1} ref={panelRef}>
        {state === "checking" && <div className="a-loading">Loading…</div>}
        {state === "out" && (
          <div className="login admin-panel-login">
            <div className="login-card">
              <button className="a-btn a-close admin-panel-x" onClick={onClose} aria-label="Close admin panel">
                ✕
              </button>
              <Wordmark size={34} />
              <h1>Admin sign in</h1>
              <p className="muted">Manage your portfolio content and messages.</p>
              <LoginForm
                onSuccess={() => {
                  setState("in");
                  router.refresh();
                }}
              />
            </div>
          </div>
        )}
        {state === "in" && <AdminDashboard onClose={onClose} onLoggedOut={() => setState("out")} />}
      </div>
    </div>
  );
}
