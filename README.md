# Dynatech Labs

Portfolio website for **Daniel Nathaniel Ayomide**: graphic design, web development and photography.
Dark and bold, mobile-first, with a built-in admin page.

## 1. Run it on your computer

1. Unzip the folder and open it in VS Code.
2. In the terminal, run:
   ```bash
   npm install
   ```
3. Copy `.env.example` to a new file called `.env.local` and fill in your values (see step 3 below).
   The site works without them and shows the starter content. You need them to log in to admin.
4. Start it:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. The admin page is at http://localhost:3000/admin.

## 2. Put it online (Vercel)

1. Push the folder to a new GitHub repo. `.env.local` is in `.gitignore`, so your secrets stay on your computer.
2. In Vercel, click **Add New → Project**, then import the repo.
3. Before deploying, open **Environment Variables** and add everything from `.env.example` with your real values.
4. Click **Deploy**. Later, to change the address, go to Settings → Domains (for example `dynatechlabs.com.ng`).

## 3. Accounts you need

| Variable | Where to get it |
|---|---|
| `ADMIN_PASSWORD` | Make one up. Use 16+ characters. |
| `SESSION_SECRET` | Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MONGODB_URI` | MongoDB Atlas → your cluster → **Connect → Drivers**. Under Network Access, allow `0.0.0.0/0` so Vercel can connect. |
| `CLOUDINARY_*` | Cloudinary dashboard → **API Keys** (cloud name, API key, API secret) |

You can reuse the same MongoDB cluster and Cloudinary account as Toylad Concept. This site uses its own
database name (`dynatech`) and its own image folder (`dynatech-labs`), so nothing mixes.

## 4. Using the admin page

Go to `/admin` and sign in with your `ADMIN_PASSWORD`. From there you can:

- **Web projects**: add, edit and reorder projects and their screenshots
- **Designs** and **Photos**: upload new work, change titles and reorder it
- **Services** and **Profile**: change your headline, bio, skills, certificates and contact details
- **Messages**: read what people send through the contact form

Changes go live as soon as you click **Save changes**.
