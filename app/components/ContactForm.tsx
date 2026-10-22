"use client";

import { useState } from "react";
import { ArrowRight } from "./Icons";

type Status = { kind: "idle" | "sending" | "ok" | "err"; text?: string };

export default function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setStatus({ kind: "ok", text: "Thanks! Your message is in. I'll get back to you soon." });
    } catch (err) {
      setStatus({ kind: "err", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="c-name">Your name</label>
        <input className="input" id="c-name" name="name" required maxLength={100} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input className="input" id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="c-type">What do you need?</label>
        <select className="select" id="c-type" name="type" defaultValue="Website">
          <option>Website</option>
          <option>Graphic design</option>
          <option>Photography</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-msg">Tell me about your project</label>
        <textarea className="textarea" id="c-msg" name="message" required maxLength={2000} />
      </div>
      {/* Honeypot: real people never see or fill this */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send message"} <ArrowRight />
      </button>
      {status.kind === "ok" && <p className="form-note ok">{status.text}</p>}
      {status.kind === "err" && (
        <p className="form-note err">
          {status.text}{" "}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            <u>Message me on WhatsApp instead.</u>
          </a>
        </p>
      )}
    </form>
  );
}
