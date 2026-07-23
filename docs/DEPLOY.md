# Deploy & Email — Yolanda Ngcuka Holdings

How to deploy this site on **Vercel**, point a custom domain with **DNS**, and configure the contact form with **EmailJS**.

Related: local setup is in [README.md](./README.md); SEO / domain checklist is in [SEO.md](./SEO.md).

---

## Architecture on Vercel

This project deploys as a **single Docker container** (`Dockerfile.vercel`):

1. Vite builds the React client (`dist/`).
2. Express (`server/`) serves the API, GridFS uploads, and the built client on `$PORT`.

So one Vercel project hosts both the marketing site and the Notice Management API. MongoDB should be hosted externally (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas)).

---

## 1. Prerequisites

| Requirement | Notes |
|-------------|--------|
| [Vercel](https://vercel.com) account | Free Hobby plan is enough to start |
| [Vercel CLI](https://vercel.com/docs/cli) (optional) | `npm i -g vercel` |
| MongoDB Atlas (or other hosted MongoDB) | Connection string for `MONGODB_URI` |
| Domain (e.g. `ynh.co.za`) | Bought at any registrar; DNS managed there or at Vercel |
| [EmailJS](https://www.emailjs.com) account | Free tier: 200 emails/month |

---

## 2. Deploy on Vercel

### A. Connect the repository

1. Push this repo to GitHub / GitLab / Bitbucket.
2. In the Vercel dashboard: **Add New… → Project** → import the repo.
3. Vercel should detect `Dockerfile.vercel`. If asked for the framework:
   - Prefer **Docker** / container build using `Dockerfile.vercel`.
4. Leave the root directory as the repo root (do not set `server/` as the root).

### B. Environment variables

In **Project → Settings → Environment Variables**, add the following for **Production** (and Preview if you use preview deploys).

#### Runtime (server)

| Variable | Example | Purpose |
|----------|---------|---------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster…/ynh_notices` | Database |
| `JWT_SECRET` | long random string | Signs admin JWTs |
| `ADMIN_EMAIL` | `admin@ynh.co.za` | Bootstrap admin login |
| `ADMIN_PASSWORD` | strong password | Bootstrap admin login |
| `ADMIN_NAME` | `YNH Administrator` | Display name |
| `CLIENT_ORIGIN` | `https://ynh.co.za` | CORS allowlist — must match the live site origin |
| `CRON_SECRET` | long random string | Optional — auth for `/api/cron/keep-alive` (Vercel Cron) |

`PORT` is set by Vercel / the Dockerfile; you do not need to set it.

MongoDB Atlas keep-alive via Vercel Cron is documented in **[MONGODB-KEEPALIVE.md](./MONGODB-KEEPALIVE.md)**.

#### Build-time (Vite — baked into the client)

These are read when Docker builds the client. Set them as Vercel env vars so they are available as build args / build env:

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_SITE_URL` | `https://ynh.co.za` | Canonical / OG / JSON-LD origin (no trailing slash) |
| `VITE_EMAILJS_SERVICE_ID` | `service_xxxxxxx` | Contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_xxxxxxx` | Contact form |
| `VITE_EMAILJS_PUBLIC_KEY` | public key from EmailJS | Contact form |

> **Important:** Changing any `VITE_*` value requires a **new deployment** (rebuild). Editing only runtime vars like `CLIENT_ORIGIN` or `MONGODB_URI` does not rebuild the client bundle.

Also update static SEO files if the live host is not `ynh.co.za` — see [SEO.md → Production domain checklist](./SEO.md#production-domain-checklist).

### C. Deploy

**Dashboard:** push to the connected branch (usually `main`), or click **Deploy**.

**CLI:**

```bash
# From the repo root (first time: link the project when prompted)
vercel

# Production
vercel --prod
```

After deploy you get a URL like `https://your-project.vercel.app`. Confirm:

- Homepage loads
- `https://…/api/health` returns `{ "ok": true }`
- Admin login works at `/admin/login`
- Contact form sends (after EmailJS is configured)

### D. Local Docker smoke test (optional)

```bash
docker build -f Dockerfile.vercel -t ynh \
  --build-arg VITE_SITE_URL=http://localhost:8080 \
  --build-arg VITE_EMAILJS_SERVICE_ID=... \
  --build-arg VITE_EMAILJS_TEMPLATE_ID=... \
  --build-arg VITE_EMAILJS_PUBLIC_KEY=... \
  .

docker run --rm -p 8080:80 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  -e CLIENT_ORIGIN=http://localhost:8080 \
  -e ADMIN_EMAIL=... \
  -e ADMIN_PASSWORD=... \
  ynh
```

Open http://localhost:8080.

---

## 3. Custom domain & DNS

Goal: serve the Vercel deployment on your own domain (e.g. `ynh.co.za` and optionally `www.ynh.co.za`).

### A. Add the domain in Vercel

1. Open the project → **Settings → Domains**.
2. Add `ynh.co.za` (apex / root).
3. Optionally add `www.ynh.co.za` and set a redirect (apex → www, or www → apex). Prefer **one** canonical host and match `VITE_SITE_URL` / `CLIENT_ORIGIN` to it.
4. Vercel shows the **exact** DNS records to create. Prefer those values over any generic examples if they differ.

### B. DNS at your registrar (external DNS)

Log in where the domain is registered (or where DNS is hosted — Cloudflare, Route 53, Domains.co.za, etc.) and add:

#### Apex domain (`ynh.co.za`)

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| `A` | `@` (or blank / root) | `76.76.21.21` | Auto or 300 |

Use the A-record IP shown in the Vercel Domains UI if it differs.

#### `www` subdomain

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| `CNAME` | `www` | The target Vercel shows (often a project-specific `*.vercel-dns-*.com`, or `cname.vercel-dns-0.com`) | Auto or 300 |

Do **not** put a CNAME on the apex if you also need MX / email records on `@` — use the A record for apex and CNAME only for `www`.

#### Domain verification (if prompted)

If Vercel asks you to prove ownership, add the **TXT** record it displays, then wait for verification.

### C. Option: Vercel nameservers

Alternatively, at the registrar set nameservers to Vercel’s NS records (shown in the Domains UI). Then manage DNS inside Vercel. Migrate any existing MX / TXT / SPF records first so email keeps working.

### D. After DNS propagates

1. In Vercel Domains, status should become **Valid** and SSL (HTTPS) issues automatically.
2. Set production env to the final origin:

```bash
VITE_SITE_URL=https://ynh.co.za
CLIENT_ORIGIN=https://ynh.co.za
```

3. **Redeploy** so the client rebuild picks up `VITE_SITE_URL` (and EmailJS keys if newly added).
4. Smoke-test:

```text
https://ynh.co.za/
https://ynh.co.za/api/health
https://ynh.co.za/robots.txt
https://ynh.co.za/sitemap.xml
```

Propagation is often minutes, sometimes up to 24–48 hours. Check with:

```bash
dig A ynh.co.za +short
dig CNAME www.ynh.co.za +short
```

### E. Keep email DNS intact

If the domain sends or receives mail (Google Workspace, Microsoft 365, etc.), leave existing **MX**, **SPF** (`TXT`), **DKIM**, and **DMARC** records alone when you only change the web A/CNAME records.

---

## 4. EmailJS setup (contact form)

The contact page sends mail **from the browser** via [EmailJS](https://www.emailjs.com). No server mail API is required. Inbox used by the app: see `CONTACT_TO_EMAIL` in `src/api/contact.ts` (currently `madimetjaterencechuene@gmail.com`).

Free tier: **200 emails/month**, no credit card.

### A. Create the EmailJS project

1. Sign up at https://www.emailjs.com and open the dashboard.
2. **Email Services → Add New Service**
   - Connect Gmail (or Outlook, etc.) for the mailbox that should *send* the notification (often the same inbox that receives enquiries).
   - Copy the **Service ID** (`service_…`).
3. **Email Templates → Create New Template**

   Recommended fields:

   | Template field | Value |
   |----------------|-------|
   | **To Email** | `email@gmail.com` (or `{{to_email}}`) |
   | **Reply To** | `{{reply_to}}` |
   | **Subject** | `Website enquiry: {{subject}}` |

   Body example:

   ```text
   New message from {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   Subject: {{subject}}

   {{message}}
   ```

4. Save and copy the **Template ID** (`template_…`).
5. **Account → General → API Keys** — copy the **Public Key**.

### B. Template variables (must match the app)

The form in `src/api/contact.ts` sends:

| Variable | Source |
|----------|--------|
| `from_name` | Name field |
| `from_email` | Email field |
| `phone` | Phone (or `"Not provided"`) |
| `subject` | Subject field |
| `message` | Message body |
| `reply_to` | Same as visitor email |
| `to_email` | `CONTACT_TO_EMAIL` constant |

Names must match exactly (including underscores).

### C. Local development

```bash
cp .env.example .env
```

Fill in:

```bash
VITE_SITE_URL=http://localhost:5173
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

Restart Vite (`npm run dev`) after any change — Vite only reads env at startup.

### D. Production (Vercel)

Add the same three `VITE_EMAILJS_*` variables in the Vercel project, then **redeploy**.

In EmailJS (Account / Security), allow your production domain (and `localhost` for local testing) if domain restriction is enabled.

### E. Verify

1. Open `/contact` on the live site.
2. Submit a short test message.
3. Confirm delivery in the To Email inbox and that **Reply** goes to the visitor’s address.

### F. Changing the destination inbox

1. Update **To Email** in the EmailJS template (and/or rely on `{{to_email}}`).
2. Update `CONTACT_TO_EMAIL` in `src/api/contact.ts`.
3. Redeploy.

---

## 5. Go-live checklist

- [ ] MongoDB Atlas (or hosted DB) reachable from Vercel; `MONGODB_URI` set
- [ ] `JWT_SECRET` and admin credentials changed from defaults
- [ ] `CLIENT_ORIGIN` equals the public HTTPS origin
- [ ] `VITE_SITE_URL` equals the same origin; SEO files updated if host ≠ `ynh.co.za`
- [ ] Custom domain added in Vercel; A / CNAME (or NS) configured; SSL Valid
- [ ] EmailJS service + template + public key set; `VITE_EMAILJS_*` on Vercel; test form sent
- [ ] `/api/health` OK; admin login works; notices upload works
- [ ] `robots.txt` and `sitemap.xml` reachable (see [SEO.md](./SEO.md))

---

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| Site loads, API CORS errors | Set `CLIENT_ORIGIN` to the exact browser origin (`https://…`, no trailing slash) and redeploy |
| Contact form: “not configured” | Missing `VITE_EMAILJS_*` at **build** time — set vars and redeploy |
| EmailJS 400 / template errors | Variable names in the template don’t match (`from_name`, etc.) |
| Domain Pending | DNS not propagated or wrong A/CNAME; compare with Vercel Domains UI |
| Admin login fails after deploy | Wrong `ADMIN_*` / `JWT_SECRET`, or DB not connected (`MONGODB_URI`) |
| Uploads missing after redeploy | Files are in GridFS — confirm `MONGODB_URI` points at the same Atlas DB |

Official docs:

- [Vercel custom domains](https://vercel.com/docs/domains/add-a-domain)
- [EmailJS docs](https://www.emailjs.com/docs/)
