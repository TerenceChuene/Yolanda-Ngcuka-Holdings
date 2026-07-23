# Yolanda Ngcuka Holdings

Public marketing site with a Notice Management admin portal.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js / Express (`server/`)
- **Database:** MongoDB

## SEO

Search, social, and crawl setup (meta tags, Open Graph, sitemap, robots, JSON-LD) is documented in **[SEO.md](./SEO.md)**.

For production builds, set `VITE_SITE_URL` to your live origin (no trailing slash). See `.env.example`.

## Deploy, DNS & EmailJS

Vercel deployment, custom domain / DNS, and EmailJS contact-form setup are documented in **[DEPLOY.md](./DEPLOY.md)**.

## MongoDB keep-alive

On Vercel (no Cron), a **GitHub Actions** job pings Atlas every 3 days so free clusters do not pause. See **[MONGODB-KEEPALIVE.md](./MONGODB-KEEPALIVE.md)**.

## Setup

1. Run MongoDB locally (or use [MongoDB Atlas](https://www.mongodb.com/atlas) for production). Default URI: `mongodb://127.0.0.1:27017/ynh_notices`.

2. Configure the API:

```bash
cp server/.env.example server/.env
```

3. Install dependencies:

```bash
npm install
npm install --prefix server
```

4. Run the API and frontend:

```bash
# Terminal 1 — API on :5000
npm run dev:server

# Terminal 2 — site on :5173
npm run dev
```

## Notice Management

| Surface | URL |
|--------|-----|
| Admin login | http://localhost:5173/admin/login |
| Admin dashboard | http://localhost:5173/admin (requires login) |
| Public notices | Home page `#notices` (only when active notices exist) |

Default admin credentials are set in `server/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). Change them before deploying.

### API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | No | Email + password → JWT |
| `GET` | `/api/auth/me` | Yes | Current admin profile |
| `GET` | `/api/notices` | No | Active notices only (`expires_at > now`) |
| `GET` | `/api/notices/admin` | Yes | All notices |
| `POST` | `/api/notices` | Yes | Multipart upload (`title`, `duration_days` 30\|60, `file`) |
| `DELETE` | `/api/notices/:id` | Yes | Delete notice + file from disk |

Uploaded files are stored in **MongoDB GridFS** (durable across deploys) and served at `/uploads/...`. A local `server/uploads/` folder is only used as a development fallback.

## Contact form (EmailJS)

Enquiries are sent from the browser via EmailJS (no backend mail API). Full setup steps, template variables, and Vercel env vars are in **[DEPLOY.md → EmailJS](./DEPLOY.md#4-emailjs-setup-contact-form)**. Local keys go in `.env` (see `.env.example`).
