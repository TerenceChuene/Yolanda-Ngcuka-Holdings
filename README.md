# Yolanda Ngcuka Holdings

Public marketing site with a Notice Management admin portal.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js / Express (`server/`)
- **Database:** MongoDB

## SEO

Search, social, and crawl setup (meta tags, Open Graph, sitemap, robots, JSON-LD) is documented in **[SEO.md](./SEO.md)**.

For production builds, set `VITE_SITE_URL` to your live origin (no trailing slash). See `.env.example`.

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

## Deploy (Vercel container)

Vercel builds `Dockerfile.vercel` and runs the Express API plus the Vite client in one container on `$PORT`.

Set these project environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME`
- `CLIENT_ORIGIN` — your production URL (e.g. `https://your-app.vercel.app`)
- `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` — from [EmailJS](https://www.emailjs.com) (free tier)

```bash
vercel deploy
```

Local image check:

```bash
docker build -f Dockerfile.vercel -t ynh .
docker run --rm -p 8080:80 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  -e CLIENT_ORIGIN=http://localhost:8080 \
  ynh
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

Uploaded files are stored in `server/uploads/` and served at `/uploads/...`.

## Contact form (EmailJS)

The contact page sends enquiries directly from the browser via [EmailJS](https://www.emailjs.com) (free: 200 emails/month, no credit card) to **example@gmail.com**. No backend mail API is required.

1. Create a free account at https://www.emailjs.com.
2. **Email Services → Add New Service** — connect Gmail (or another provider) and copy the **Service ID**.
3. **Email Templates → Create New Template** with:
   - **To Email:** `example@gmail.com`
   - **Reply To:** `{{reply_to}}`
   - **Subject:** `Website enquiry: {{subject}}`
   - **Content** (example):

```text
New message from {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

{{message}}
```

4. Open **Account → API Keys** and copy your **Public Key**.
5. Copy `.env.example` to `.env` in the project root and fill in:

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

6. Restart the frontend (`npm run dev`).

Template variables used by the form: `from_name`, `from_email`, `phone`, `subject`, `message`, `reply_to`, `to_email`.
