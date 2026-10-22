"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// The panel (dashboard, login form, admin CSS) is only fetched after the first click.
const AdminPanel = dynamic(() => import("@/app/admin/AdminPanel"), { ssr: false });

export default function AdminLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="footer-admin" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Admin
      </button>
      {open && <AdminPanel onClose={() => setOpen(false)} />}
    </>
  );
}
