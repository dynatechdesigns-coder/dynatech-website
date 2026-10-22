"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Wordmark } from "@/app/components/Logo";
import type { Design, EditableSection, Message, Photo, Profile, Project, Service, SiteContent } from "@/lib/types";

type Tab = EditableSection | "messages";
const TABS: { id: Tab; label: string }[] = [
  { id: "projects", label: "Web projects" },
  { id: "designs", label: "Designs" },
  { id: "photos", label: "Photos" },
  { id: "services", label: "Services" },
  { id: "profile", label: "Profile" },
  { id: "messages", label: "Messages" },
];

const newId = () => Math.random().toString(36).slice(2, 10);

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("projects");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [status, setStatus] = useState({ database: false, uploads: false });
  const [dirty, setDirty] = useState<Set<EditableSection>>(new Set());
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/content", { cache: "no-store" });
    if (res.status === 401) return (window.location.href = "/admin/login");
    const json = (await res.json()) as { content: SiteContent; database: boolean; uploads: boolean };
    setContent(json.content);
    setSaved(JSON.stringify(json.content));
    setStatus({ database: json.database, uploads: json.uploads });
    setDirty(new Set());
  }, []);

  const loadMessages = useCallback(async () => {
    const res = await fetch("/api/admin/messages", { cache: "no-store" });
    if (res.ok) setMessages(((await res.json()) as { messages: Message[] }).messages);
  }, []);

  useEffect(() => {
    load();
    loadMessages();
  }, [load, loadMessages]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.size) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function update<K extends EditableSection>(section: K, value: SiteContent[K]) {
    setContent((c) => (c ? { ...c, [section]: value } : c));
    setDirty((d) => new Set(d).add(section));
  }

  async function save(section: EditableSection) {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, value: content[section] }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 401) return (window.location.href = "/admin/login");
      if (!res.ok) throw new Error(json.error || "Save failed.");
      setDirty((d) => {
        const n = new Set(d);
        n.delete(section);
        return n;
      });
      setToast({ kind: "ok", text: "Saved. Your website is updated." });
    } catch (err) {
      setToast({ kind: "err", text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    if (!saved) return;
    setContent(JSON.parse(saved));
    setDirty(new Set());
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const unread = messages.filter((m) => !m.read).length;

  if (!content) {
    return <div className="a-loading">Loading your content…</div>;
  }

  const section = tab === "messages" ? null : (tab as EditableSection);

  return (
    <div className="a-shell">
      <header className="a-top">
        <a href="/admin" className="a-brand">
          <Wordmark size={28} />
          <span className="a-tag">Admin</span>
        </a>
        <div className="a-top-actions">
          <a className="a-btn" href="/" target="_blank" rel="noopener">
            View site ↗
          </a>
          <button className="a-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      {!status.database && (
        <div className="a-banner warn">
          <b>Not connected to a database.</b> You&apos;re seeing the starter content. Add <code>MONGODB_URI</code> to your
          environment variables to save changes and receive contact messages.
        </div>
      )}
      {status.database && !status.uploads && (
        <div className="a-banner">
          Image uploads are off. Add the <code>CLOUDINARY_*</code> variables to upload from here, or paste image links.
        </div>
      )}

      <nav className="a-tabs" aria-label="Sections">
        {TABS.map((t) => (
          <button key={t.id} className={`a-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id !== "messages" && dirty.has(t.id as EditableSection) && <span className="a-dot" title="Unsaved" />}
            {t.id === "messages" && unread > 0 && <span className="a-count">{unread}</span>}
          </button>
        ))}
      </nav>

      <main className="a-main">
        {tab === "projects" && (
          <ListEditor<Project>
            title="Web projects"
            hint="Shown in the Web projects section. The first image is the big screenshot."
            items={content.projects}
            onChange={(v) => update("projects", v)}
            blank={() => ({ id: newId(), title: "New project", category: "", summary: "", features: [], stack: [], url: "https://", images: [] })}
            render={(p, set) => (
              <>
                <Row>
                  <Text label="Title" value={p.title} onChange={(v) => set({ ...p, title: v })} />
                  <Text label="Category" value={p.category} onChange={(v) => set({ ...p, category: v })} placeholder="Business website + admin dashboard" />
                </Row>
                <Text label="Live link" value={p.url} onChange={(v) => set({ ...p, url: v })} placeholder="https://…" />
                <Area label="Summary" value={p.summary} onChange={(v) => set({ ...p, summary: v })} />
                <Row>
                  <Lines label="Features (one per line)" value={p.features} onChange={(v) => set({ ...p, features: v })} />
                  <Lines label="Built with (one per line)" value={p.stack} onChange={(v) => set({ ...p, stack: v })} />
                </Row>
                <ImageList label="Screenshots" value={p.images} uploads={status.uploads} onChange={(v) => set({ ...p, images: v })} />
              </>
            )}
          />
        )}

        {tab === "designs" && (
          <ListEditor<Design>
            title="Design work"
            hint="Flyers, posters and other graphics. Shown in a masonry grid."
            items={content.designs}
            onChange={(v) => update("designs", v)}
            blank={() => ({ id: newId(), title: "New design", client: "", category: "Event flyer", image: "" })}
            compact
            render={(d, set) => (
              <div className="a-media-row">
                <ImageField value={d.image} uploads={status.uploads} onChange={(v) => set({ ...d, image: v })} />
                <div className="a-grow">
                  <Text label="Title" value={d.title} onChange={(v) => set({ ...d, title: v })} />
                  <Row>
                    <Text label="Client" value={d.client} onChange={(v) => set({ ...d, client: v })} />
                    <Text label="Type" value={d.category} onChange={(v) => set({ ...d, category: v })} placeholder="Event flyer" />
                  </Row>
                </div>
              </div>
            )}
          />
        )}

        {tab === "photos" && (
          <ListEditor<Photo>
            title="Photography"
            hint="The first photo is shown large."
            items={content.photos}
            onChange={(v) => update("photos", v)}
            blank={() => ({ id: newId(), title: "New photo", image: "" })}
            compact
            render={(ph, set) => (
              <div className="a-media-row">
                <ImageField value={ph.image} uploads={status.uploads} onChange={(v) => set({ ...ph, image: v })} />
                <div className="a-grow">
                  <Text label="Caption" value={ph.title} onChange={(v) => set({ ...ph, title: v })} />
                </div>
              </div>
            )}
          />
        )}

        {tab === "services" && (
          <ListEditor<Service & { id?: string }>
            title="Services"
            hint="What people can hire you for."
            items={content.services}
            onChange={(v) => update("services", v)}
            blank={() => ({ title: "New service", text: "", items: [] })}
            render={(s, set) => (
              <>
                <Text label="Title" value={s.title} onChange={(v) => set({ ...s, title: v })} />
                <Text label="Short description" value={s.text} onChange={(v) => set({ ...s, text: v })} />
                <Lines label="What's included (one per line)" value={s.items} onChange={(v) => set({ ...s, items: v })} />
              </>
            )}
          />
        )}

        {tab === "profile" && <ProfileEditor profile={content.profile} uploads={status.uploads} onChange={(v) => update("profile", v)} />}

        {tab === "messages" && <Messages messages={messages} reload={loadMessages} database={status.database} />}
      </main>

      {section && dirty.has(section) && (
        <div className="a-savebar">
          <span>You have unsaved changes in {TABS.find((t) => t.id === section)?.label}.</span>
          <div>
            <button className="a-btn" onClick={discard} disabled={saving}>
              Discard all
            </button>
            <button className="a-btn a-btn-primary" onClick={() => save(section)} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {toast && <div className={`a-toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}

/* ---------------- List editor ---------------- */

function ListEditor<T>({
  title,
  hint,
  items,
  onChange,
  blank,
  render,
  compact,
}: {
  title: string;
  hint: string;
  items: T[];
  onChange: (v: T[]) => void;
  blank: () => T;
  render: (item: T, set: (v: T) => void) => React.ReactNode;
  compact?: boolean;
}) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <section>
      <div className="a-head">
        <div>
          <h2>{title}</h2>
          <p className="muted">{hint}</p>
        </div>
        <button className="a-btn a-btn-primary" onClick={() => onChange([blank(), ...items])}>
          + Add new
        </button>
      </div>
      {items.length === 0 && <p className="a-empty">Nothing here yet. Click “Add new”.</p>}
      <div className={`a-list ${compact ? "compact" : ""}`}>
        {items.map((item, i) => (
          <div className="a-card" key={i}>
            <div className="a-card-tools">
              <span className="a-num">{i + 1}</span>
              <button className="a-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                ↑
              </button>
              <button className="a-icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                ↓
              </button>
              <button
                className="a-icon danger"
                aria-label="Delete"
                onClick={() => {
                  if (confirm("Remove this item? (It's only gone for good after you save.)")) {
                    onChange(items.filter((_, k) => k !== i));
                  }
                }}
              >
                ✕
              </button>
            </div>
            {render(item, (v) => onChange(items.map((x, k) => (k === i ? v : x))))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Profile ---------------- */

function ProfileEditor({ profile: p, uploads, onChange }: { profile: Profile; uploads: boolean; onChange: (p: Profile) => void }) {
  const set = (patch: Partial<Profile>) => onChange({ ...p, ...patch });
  return (
    <section>
      <div className="a-head">
        <div>
          <h2>Profile</h2>
          <p className="muted">Your hero text, About section and contact details.</p>
        </div>
      </div>
      <div className="a-card">
        <div className="a-media-row">
          <ImageField value={p.photo} uploads={uploads} onChange={(v) => set({ photo: v })} />
          <div className="a-grow">
            <Row>
              <Text label="Full name" value={p.name} onChange={(v) => set({ name: v })} />
              <Text label="Role" value={p.role} onChange={(v) => set({ role: v })} />
            </Row>
            <Row>
              <Text label="Location" value={p.location} onChange={(v) => set({ location: v })} />
              <label className="a-check">
                <input type="checkbox" checked={p.available} onChange={(e) => set({ available: e.target.checked })} />
                Show “Available for new projects”
              </label>
            </Row>
          </div>
        </div>
        <Text label="Headline (two sentences → two lines)" value={p.headline} onChange={(v) => set({ headline: v })} />
        <Area label="Intro (under the headline)" value={p.intro} onChange={(v) => set({ intro: v })} />
        <Area
          label="About me (leave a blank line between paragraphs)"
          rows={7}
          value={p.bio.join("\n\n")}
          onChange={(v) => set({ bio: v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })}
        />
        <Lines label="Skills (one per line)" value={p.skills} onChange={(v) => set({ skills: v })} />
      </div>

      <h3 className="a-sub">Contact</h3>
      <div className="a-card">
        <Row>
          <Text label="Email" value={p.email} onChange={(v) => set({ email: v })} />
          <Text label="Phone / WhatsApp" value={p.phone} onChange={(v) => set({ phone: v })} placeholder="08053801610" />
        </Row>
        <Row>
          <Text label="X (Twitter) link" value={p.socials.x || ""} onChange={(v) => set({ socials: { ...p.socials, x: v } })} />
          <Text label="LinkedIn link" value={p.socials.linkedin || ""} onChange={(v) => set({ socials: { ...p.socials, linkedin: v } })} />
        </Row>
        <Row>
          <Text label="GitHub link" value={p.socials.github || ""} onChange={(v) => set({ socials: { ...p.socials, github: v } })} />
          <Text label="Instagram link" value={p.socials.instagram || ""} onChange={(v) => set({ socials: { ...p.socials, instagram: v } })} />
        </Row>
      </div>

      <h3 className="a-sub">Hero numbers</h3>
      <div className="a-card">
        {p.stats.map((s, i) => (
          <Row key={i}>
            <Text label="Number" value={s.value} onChange={(v) => set({ stats: p.stats.map((x, k) => (k === i ? { ...x, value: v } : x)) })} />
            <Text label="Label" value={s.label} onChange={(v) => set({ stats: p.stats.map((x, k) => (k === i ? { ...x, label: v } : x)) })} />
          </Row>
        ))}
      </div>

      <h3 className="a-sub">Certifications & education</h3>
      <div className="a-card">
        {p.certifications.map((c, i) => (
          <div className="a-row a-row-3" key={i}>
            <Text label="Certificate" value={c.title} onChange={(v) => set({ certifications: p.certifications.map((x, k) => (k === i ? { ...x, title: v } : x)) })} />
            <Text label="Issuer" value={c.issuer} onChange={(v) => set({ certifications: p.certifications.map((x, k) => (k === i ? { ...x, issuer: v } : x)) })} />
            <div className="a-inline">
              <Text label="Year" value={c.year || ""} onChange={(v) => set({ certifications: p.certifications.map((x, k) => (k === i ? { ...x, year: v } : x)) })} />
              <button className="a-icon danger" aria-label="Remove" onClick={() => set({ certifications: p.certifications.filter((_, k) => k !== i) })}>
                ✕
              </button>
            </div>
          </div>
        ))}
        <button className="a-btn" onClick={() => set({ certifications: [...p.certifications, { title: "", issuer: "" }] })}>
          + Add certificate
        </button>
        <div className="a-row a-row-3" style={{ marginTop: 18 }}>
          <Text label="Degree" value={p.education.degree} onChange={(v) => set({ education: { ...p.education, degree: v } })} />
          <Text label="School" value={p.education.school} onChange={(v) => set({ education: { ...p.education, school: v } })} />
          <Text label="Year" value={p.education.year} onChange={(v) => set({ education: { ...p.education, year: v } })} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Messages ---------------- */

function Messages({ messages, reload, database }: { messages: Message[]; reload: () => void; database: boolean }) {
  async function mark(id: string, read: boolean) {
    await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read }) });
    reload();
  }
  async function remove(id: string) {
    if (!confirm("Delete this message for good?")) return;
    await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    reload();
  }
  return (
    <section>
      <div className="a-head">
        <div>
          <h2>Messages</h2>
          <p className="muted">From the contact form on your website.</p>
        </div>
        <button className="a-btn" onClick={reload}>
          Refresh
        </button>
      </div>
      {!database && <p className="a-empty">Connect MongoDB to start receiving messages.</p>}
      {database && messages.length === 0 && <p className="a-empty">No messages yet.</p>}
      <div className="a-list">
        {messages.map((m) => (
          <article className={`a-card a-msg ${m.read ? "" : "unread"}`} key={m._id}>
            <div className="a-msg-head">
              <div>
                <b>{m.name}</b> <span className="muted">· {m.email}</span>
                {m.type && <span className="a-pill">{m.type}</span>}
              </div>
              <time className="muted small">{new Date(m.createdAt).toLocaleString()}</time>
            </div>
            <p className="a-msg-body">{m.message}</p>
            <div className="a-msg-actions">
              <a className="a-btn a-btn-primary" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Dynatech Labs")}`}>
                Reply by email
              </a>
              <button className="a-btn" onClick={() => mark(m._id!, !m.read)}>
                Mark as {m.read ? "unread" : "read"}
              </button>
              <button className="a-btn danger" onClick={() => remove(m._id!)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Fields ---------------- */

function Row({ children }: { children: React.ReactNode }) {
  return <div className="a-row">{children}</div>;
}

function Text({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <input className="a-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <textarea className="a-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/** A list of strings edited as one-per-line text. Keeps blank lines while typing. */
function Lines({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join("\n"));
  useEffect(() => {
    if (text.split("\n").map((s) => s.trim()).filter(Boolean).join("\n") !== value.join("\n")) setText(value.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <label className="a-field">
      <span className="a-label">{label}</span>
      <textarea
        className="a-input"
        rows={Math.max(3, value.length + 1)}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
        }}
      />
    </label>
  );
}

async function uploadToCloudinary(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image is over 10 MB. Please use a smaller file.");
  const sig = await fetch("/api/admin/sign-upload", { method: "POST" });
  const s = (await sig.json()) as { cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string; error?: string };
  if (!sig.ok) throw new Error(s.error || "Upload not available.");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", s.apiKey);
  fd.append("timestamp", String(s.timestamp));
  fd.append("folder", s.folder);
  fd.append("signature", s.signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: "POST", body: fd });
  const json = (await res.json()) as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !json.secure_url) throw new Error(json.error?.message || "Upload failed.");
  return json.secure_url;
}

function ImageField({ value, onChange, uploads }: { value: string; onChange: (v: string) => void; uploads: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const preview = useMemo(() => value || "", [value]);
  return (
    <div className="a-image">
      <div className="a-thumb">{preview ? <img src={preview} alt="" /> : <span className="muted small">No image</span>}</div>
      {uploads && (
        <label className="a-btn a-upload">
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={busy}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setBusy(true);
              setErr("");
              try {
                onChange(await uploadToCloudinary(f));
              } catch (x) {
                setErr(x instanceof Error ? x.message : "Upload failed.");
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      )}
      <input className="a-input a-input-sm" value={value} placeholder="or paste an image link" onChange={(e) => onChange(e.target.value)} />
      {err && <p className="a-error small">{err}</p>}
    </div>
  );
}

function ImageList({ label, value, onChange, uploads }: { label: string; value: string[]; onChange: (v: string[]) => void; uploads: boolean }) {
  return (
    <div className="a-field">
      <span className="a-label">{label}</span>
      <div className="a-image-list">
        {value.map((src, i) => (
          <div key={i} className="a-image-item">
            <ImageField value={src} uploads={uploads} onChange={(v) => onChange(value.map((x, k) => (k === i ? v : x)))} />
            <div className="a-inline">
              <button className="a-icon" disabled={i === 0} onClick={() => { const n = [...value]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }} aria-label="Move left">←</button>
              <button className="a-icon danger" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove image">✕</button>
            </div>
          </div>
        ))}
        <button className="a-add-image" onClick={() => onChange([...value, ""])}>
          + Add screenshot
        </button>
      </div>
    </div>
  );
}
