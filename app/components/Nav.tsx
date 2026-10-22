"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import { Close, Menu } from "./Icons";

const LINKS = [
  { href: "#work", label: "Web" },
  { href: "#design", label: "Design" },
  { href: "#photography", label: "Photography" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
];

export default function Nav({ whatsapp }: { whatsapp: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a href="#top" aria-label="Dynatech Labs — back to top" onClick={() => setOpen(false)}>
          <Wordmark size={30} />
        </a>
        <nav aria-label="Main">
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-primary btn-sm nav-cta" href="#contact">
          Let&apos;s talk
        </a>
        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a className="btn btn-primary" href={whatsapp} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp
        </a>
      </div>
    </header>
  );
}
