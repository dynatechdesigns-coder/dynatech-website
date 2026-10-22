import type { SiteContent } from "@/lib/types";
import { img, telLink, whatsappLink } from "@/lib/image";
import { LogoMark, Wordmark } from "./Logo";
import Nav from "./Nav";
import Gallery from "./Gallery";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import AdminLauncher from "./AdminLauncher";
import { ArrowRight, ArrowUpRight, GitHub, Instagram, LinkedIn, Mail, Phone, WhatsApp, XLogo } from "./Icons";

const MARQUEE = ["Brand identity", "Flyers & posters", "Websites", "Admin dashboards", "Social media design", "Photography"];

function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function HomePage({ content }: { content: SiteContent }) {
  const { profile, projects, designs, photos, services } = content;
  const wa = whatsappLink(profile.phone, "Hi Daniel, I found you on Dynatech Labs and I'd like to talk about a project.");
  const firstName = profile.name.split(" ")[0];
  const year = new Date().getFullYear();

  const socials = [
    profile.socials.x && { href: profile.socials.x, label: "X (Twitter)", icon: <XLogo /> },
    profile.socials.linkedin && { href: profile.socials.linkedin, label: "LinkedIn", icon: <LinkedIn /> },
    profile.socials.github && { href: profile.socials.github, label: "GitHub", icon: <GitHub /> },
    profile.socials.instagram && { href: profile.socials.instagram, label: "Instagram", icon: <Instagram /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Abuja", addressCountry: "NG" },
    worksFor: { "@type": "Organization", name: "Dynatech Labs" },
    sameAs: socials.map((s) => s.href),
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav whatsapp={wa} />
      <Reveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <main id="main">
        {/* ---------------- HERO ---------------- */}
        <section className="hero" id="top">
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className="container hero-inner">
            <div>
              {profile.available && (
                <span className="hero-badge">
                  <span className="dot" /> Available for new projects · {profile.location}
                </span>
              )}
              <h1>
                {splitHeadline(profile.headline).map((line, i) => (
                  <span key={i} className={i === 1 ? "accent" : undefined} style={{ display: "block" }}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className="hero-intro">
                {profile.intro}
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#work">
                  View my work <ArrowRight />
                </a>
                <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">
                  <WhatsApp /> WhatsApp me
                </a>
              </div>
              {profile.stats.length > 0 && (
                <div className="hero-stats">
                  {profile.stats.map((s) => (
                    <div key={s.label}>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hero-visual">
              <div className="portrait">
                <img src={img(profile.photo, 800)} alt={`Portrait of ${profile.name}`} fetchPriority="high" />
                <div className="portrait-caption">
                  <b>{profile.name}</b>
                  <span>Founder, Dynatech Labs</span>
                </div>
              </div>
              <div className="hero-mark">
                <LogoMark size={52} />
              </div>
              <div className="hero-chip">
                <b>Design → Code</b>
                <span>One person, start to finish</span>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
              <span className="marquee-item" key={i}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* ---------------- WEB WORK ---------------- */}
        <section className="section" id="work">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">Selected work</span>
                <h2 className="section-title">
                  Web <span className="thin">projects</span>
                </h2>
              </div>
              <p className="section-lead">
                Live websites and web apps — designed, built and launched by me, with dashboards so owners can run
                them without a developer.
              </p>
            </div>

            <div className="projects">
              {projects.map((p, i) => (
                <article className="project reveal" key={p.id}>
                  <div className="project-media">
                    <a className="browser" href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                      <div className="browser-bar">
                        <i />
                        <i />
                        <i />
                        <span className="browser-url">{hostOf(p.url)}</span>
                      </div>
                      {p.images[0] && <img src={img(p.images[0], 1400)} alt={`${p.title} — homepage`} loading="lazy" />}
                    </a>
                    {p.images.length > 1 && (
                      <Gallery
                        layout="thumbs"
                        items={p.images.slice(1).map((src, k) => ({
                          src: img(src, 500),
                          full: img(src, 1800),
                          title: `${p.title} — screen ${k + 2}`,
                        }))}
                      />
                    )}
                  </div>
                  <div>
                    <span className="project-index">{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                    <h3>{p.title}</h3>
                    <div className="project-category">{p.category}</div>
                    <p className="project-summary">{p.summary}</p>
                    {p.features.length > 0 && (
                      <ul className="feature-list">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    )}
                    {p.stack.length > 0 && (
                      <div className="chips">
                        {p.stack.map((s) => (
                          <span className="chip" key={s}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <a className="btn btn-ghost project-link" href={p.url} target="_blank" rel="noopener noreferrer">
                      Visit live site <ArrowUpRight />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- DESIGN ---------------- */}
        <section className="section section-alt" id="design">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">Graphic design</span>
                <h2 className="section-title">
                  Design <span className="thin">work</span>
                </h2>
              </div>
              <p className="section-lead">
                Event flyers, posters, billboards and social media designs for churches, ministries and organisations.
              </p>
            </div>
            <div className="reveal">
              <Gallery
                layout="masonry"
                items={designs.map((d) => ({
                  src: img(d.image, 700),
                  full: img(d.image, 1800),
                  title: d.title,
                  subtitle: [d.category, d.client].filter(Boolean).join(" · "),
                }))}
              />
            </div>
          </div>
        </section>

        {/* ---------------- PHOTOGRAPHY ---------------- */}
        {photos.length > 0 && (
          <section className="section" id="photography">
            <div className="container">
              <div className="section-head reveal">
                <div>
                  <span className="eyebrow">Media</span>
                  <h2 className="section-title">
                    Photo<span className="thin">graphy</span>
                  </h2>
                </div>
                <p className="section-lead">
                  A growing passion. Events, culture and portraits, shot and edited by me.
                </p>
              </div>
              <div className="reveal">
                <Gallery
                  layout="photo"
                  items={photos.map((p) => ({ src: img(p.image, 900), full: img(p.image, 2000), title: p.title }))}
                />
              </div>
            </div>
          </section>
        )}

        {/* ---------------- SERVICES ---------------- */}
        <section className="section section-alt" id="services">
          <div className="container">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">What I do</span>
                <h2 className="section-title">
                  Services
                </h2>
              </div>
              <p className="section-lead">From the first sketch to the live website, with one person who cares about every detail.</p>
            </div>
            <div className="services">
              {services.map((s, i) => (
                <div className="service reveal" key={s.title}>
                  <div className="service-num">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul>
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- ABOUT ---------------- */}
        <section className="section" id="about">
          <div className="container about">
            <div className="about-photo about-brand reveal" aria-hidden="true">
              <div className="hero-grid" />
              <LogoMark size={190} />
              <div className="about-photo-caption">
                <b>DYNATECH LABS</b>
                Design · Code · Media
              </div>
            </div>
            <div className="reveal">
              <span className="eyebrow">About me</span>
              <h2 className="section-title" style={{ marginBottom: 28 }}>
                Hi, I&apos;m {firstName}
              </h2>
              <div className="about-bio">
                {profile.bio.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="about-block">
                <h4>Skills</h4>
                <div className="chips" style={{ marginTop: 0 }}>
                  {profile.skills.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="about-block">
                <h4>Certifications</h4>
                <ul className="cert-list">
                  {profile.certifications.map((c) => (
                    <li className="cert" key={c.title}>
                      <b>{c.title}</b>
                      <span>
                        {c.issuer}
                        {c.year ? ` · ${c.year}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="about-block">
                <h4>Education</h4>
                <div className="cert">
                  <b>{profile.education.degree}</b>
                  <span>
                    {profile.education.school} · {profile.education.year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section className="section" id="contact" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="contact-card reveal">
              <div>
                <span className="eyebrow">Contact</span>
                <h2>
                  Let&apos;s build <span>something.</span>
                </h2>
                <p className="contact-lead">
                  Need a brand, a website or great photos? Send a message and I&apos;ll reply as soon as I can. WhatsApp
                  is the fastest way to reach me.
                </p>
                <div className="contact-methods">
                  <a className="contact-method" href={wa} target="_blank" rel="noopener noreferrer">
                    <span className="icon">
                      <WhatsApp />
                    </span>
                    <span>
                      <small>WhatsApp</small>
                      <b>Chat with me now</b>
                    </span>
                  </a>
                  <a className="contact-method" href={`mailto:${profile.email}`}>
                    <span className="icon">
                      <Mail />
                    </span>
                    <span>
                      <small>Email</small>
                      <b>{profile.email}</b>
                    </span>
                  </a>
                  <a className="contact-method" href={telLink(profile.phone)}>
                    <span className="icon">
                      <Phone />
                    </span>
                    <span>
                      <small>Call</small>
                      <b>{formatPhone(profile.phone)}</b>
                    </span>
                  </a>
                </div>
              </div>
              <ContactForm whatsapp={wa} />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <Wordmark size={34} showName />
            <div className="socials">
              {socials.map((s) => (
                <a className="social" key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {year} Dynatech Labs · {profile.name}
            </span>
            <span>
              Designed &amp; built in {profile.location} · <AdminLauncher />
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

/** "Design that speaks. Websites that work." → two lines, the second gets the accent colour. */
function splitHeadline(h: string): string[] {
  const parts = h.split(/(?<=\.)\s+/).filter(Boolean);
  return parts.length >= 2 ? [parts[0], parts.slice(1).join(" ")] : [h];
}

function formatPhone(p: string): string {
  const d = p.replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : p;
}
