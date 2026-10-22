# Dynatech Labs: portfolio website

Personal portfolio site for **Daniel Nathaniel Ayomide**, a graphic designer and web developer in Abuja, Nigeria.
The brand is **Dynatech Labs**: "DYNATECH" is large and "LABS" is small and tracked out, next to the hexagon "S" mark.
Daniel's name appears with the brand (hero, About, footer), but the brand comes first.

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript, deployed on **Vercel**
- **MongoDB** (driver `mongodb`) stores the content and contact-form messages
- **Cloudinary** stores images uploaded from the admin page. Uploads are signed on the server and go straight from the browser to Cloudinary. The Cloudinary SDK is not used.
- Plain CSS (`app/globals.css`, `app/admin/admin.css`), no Tailwind
- Fonts: Oxanium (display/headings) + Inter (body) via `next/font/google`

## Commands
- `npm install`: install dependencies
- `npm run dev`: local dev at http://localhost:3000 (admin at /admin)
- `npm run build`: production build (run this before pushing)

## Structure
```
app/
  page.tsx                  Home page (server). Loads content, renders <HomePage>
  layout.tsx                Fonts, SEO metadata, Open Graph image
  globals.css               Design system + all public styles
  icon.svg                  Favicon (the mark)
  components/
    HomePage.tsx            All public sections: hero, web work, design, photography, services, about, contact, footer
    Logo.tsx                LogoMark (SVG) + Wordmark (DYNATECH + small LABS)
    Nav.tsx                 Fixed nav + mobile menu (client)
    Gallery.tsx             Grid + lightbox for designs, photos and screenshots (client)
    ContactForm.tsx         Posts to /api/contact (client)
    Reveal.tsx              Scroll fade-in (client; content stays visible without JS)
    Icons.tsx               Inline SVG icons
  admin/
    login/page.tsx          Password login
    page.tsx                Renders AdminDashboard
    AdminDashboard.tsx      Tabs: Web projects, Designs, Photos, Services, Profile, Messages
    admin.css
  api/
    contact/route.ts        Public. Validates, honeypot, rate limit, saves to `messages`
    admin/login|logout      Session cookie
    admin/content           GET all content / PUT one section (validated)
    admin/messages          GET / PATCH read / DELETE
    admin/sign-upload       Returns a Cloudinary upload signature
lib/
  types.ts                  SiteContent, Project, Design, Photo, Service, Profile, Message
  seed.ts                   Starter content (used until the first save in /admin)
  content.ts                getContent() (Mongo with seed fallback) + saveSection()
  db.ts                     Cached MongoClient
  auth.ts                   HMAC-signed session (Web Crypto), safeEqual, rateLimit
  image.ts                  img() Cloudinary resize helper, whatsappLink(), telLink()
middleware.ts               Protects /admin/* and /api/admin/* (except login)
public/
  brand/                    daniel.webp (portrait), og.png (share image), dynatech-mark*.svg
  work/web|design|photo/    Starter images (WebP)
```

## How content works
- All content lives in one MongoDB document `{ _id: "site" }` in the `content` collection, with keys
  `profile`, `projects`, `designs`, `photos`, `services`. Each admin tab saves one key (`saveSection`).
- If `MONGODB_URI` is missing or the DB is unreachable, the site shows `lib/seed.ts`, so it never breaks.
- The home page uses `revalidate = 60`. Saving in admin calls `revalidatePath("/")` so changes show up at once.
- Contact messages go to the `messages` collection.

## Security rules (keep these)
- Never commit `.env*` files. Secrets live only in `.env.local` and the Vercel environment variables.
- Admin auth: `ADMIN_PASSWORD` + `SESSION_SECRET` (32+ chars). The cookie is httpOnly, SameSite=strict, secure in production, and lasts 8h.
- Every `/api/admin/*` route relies on `middleware.ts`. If you add an admin route, keep it under `/api/admin/`.
- The content API only accepts `https://` links or local `/...` paths for images, URLs and socials. This blocks `javascript:` URLs.
- The Cloudinary API secret never goes to the browser. Only a signature does.
- Login and contact are rate-limited in memory (per serverless instance).
- Security headers are set in `next.config.mjs`. /admin is `noindex`.

## Design system
- Dark and bold: `--bg #05070d`, surfaces `#0c1222`, accent electric blue `--accent #2f7bff` / `--accent-2 #6db6ff`.
- Headings: Oxanium, uppercase, weight 800. Section heads pair a bright word with a dim one (`.thin`).
- Logo mark path is in `app/components/Logo.tsx` (`MARK_PATH`). Reuse `<LogoMark>` / `<Wordmark>` and don't redraw it.
- Mobile first: check every change at 390px wide. No horizontal scroll.

## Still to confirm with Daniel
- Full tech stack for each project (the "Built with" chips only list what's confirmed)
- Whether the Google Cybersecurity certificate is finished (add the year in /admin → Profile)
- A cleaner headshot would improve the hero (the current photo is graded to hide a busy background)
