<div align="center">

# DYNATECH <sub>LABS</sub>

**Graphic design · Web development · Photography**

A dark, bold portfolio website with a built-in admin page, so I can update my work without touching code.

[Live site](https://YOUR-SITE.vercel.app) · [X / Twitter](https://x.com/Dynatechdesign) · [LinkedIn](https://linkedin.com/in/nathaniel-daniel-652307381)

</div>

---

## About

Dynatech Labs is the personal brand of **Daniel Nathaniel Ayomide**, a graphic designer and web developer based in Abuja, Nigeria. This site showcases my web projects, design work and photography, and lets people contact me directly.

## Features

- **Dark, bold design** with the Dynatech Labs hexagon mark and wordmark
- **Three showcases:** web projects, graphic design and photography, each with a full-screen lightbox gallery
- **Mobile first:** built for phones, no horizontal scrolling
- **Contact form** with spam protection, plus one-tap call and WhatsApp links
- **Built-in admin page** at `/admin` to add, edit and reorder projects, designs, photos and services, edit profile details and read messages
- **Works without a database:** shows starter content until the first save in admin
- **Fast and shareable:** SEO metadata and a custom link preview image

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Plain CSS, Oxanium and Inter fonts |
| Database | MongoDB Atlas |
| Image uploads | Cloudinary (signed, browser-direct uploads) |
| Hosting | Vercel |

## Getting started

```bash
git clone https://github.com/dynatechdesigns-coder/dynatech-labs.git
cd dynatech-labs
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin page is at [http://localhost:3000/admin](http://localhost:3000/admin).

### Environment variables

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for the admin page (16+ characters) |
| `SESSION_SECRET` | Random string that signs the login cookie |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB` | Database name (default `dynatech`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image uploads |
| `NEXT_PUBLIC_SITE_URL` | Live address, used for link previews |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Never commit `.env.local`. It is already in `.gitignore`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel choose **Add New → Project** and import the repo.
3. Add the environment variables above.
4. Click **Deploy**.

## Project structure

```
app/            Pages, components and API routes
  admin/        Admin login and dashboard
  api/          Contact form, admin content, messages, upload signing
lib/            Content, database, auth and image helpers
public/         Brand assets and starter images
middleware.ts   Protects /admin and /api/admin
```

## Security

- Admin login uses a signed, `httpOnly`, `SameSite=strict` cookie that expires after 8 hours
- Admin pages and APIs are protected by middleware
- Login and contact form are rate limited, and the contact form has a honeypot
- Only `https://` links and local paths are accepted in content, blocking `javascript:` URLs
- The Cloudinary secret stays on the server; the browser only receives a signature
- Security headers are set, and `/admin` is hidden from search engines

## Contact

**Daniel Nathaniel Ayomide** · Abuja, Nigeria
Email: dynatechdesigns@gmail.com · WhatsApp: 08053801610
X: [@Dynatechdesign](https://x.com/Dynatechdesign)

---

<div align="center">

© Dynatech Labs · Designed and built in Abuja

</div>
