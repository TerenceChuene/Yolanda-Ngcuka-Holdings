# MongoDB keep-alive

How the app prevents a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster from pausing due to inactivity when the site is hosted on **Vercel** (Hobby / no Vercel Cron).

## Why this exists

Atlas free (M0) clusters can pause after a long period with no connections. An in-process timer does **not** work on Vercel:

- The app scales to **zero** when idle.
- `setInterval` dies with the instance.
- **Vercel Cron** is not used here (requires a plan that includes cron jobs).

Keep-alive is driven by an **external HTTP request** on a schedule: wake the app, then ping MongoDB.

## How it works

```text
GitHub Actions (every 3 days, UTC)
        │
        │  GET /api/keep-alive
        │  (+ Authorization: Bearer <CRON_SECRET> if set)
        ▼
Express on Vercel (server/src/index.js)
        │
        │  pingMongo()
        ▼
MongoDB Atlas  →  db.admin().ping()
```

1. Workflow [`.github/workflows/mongodb-keep-alive.yml`](../.github/workflows/mongodb-keep-alive.yml) runs on a schedule (`0 0 */3 * *` — every 3 days at midnight UTC) and on manual **Run workflow**.
2. It `curl`s your live `/api/keep-alive` URL.
3. Express calls `pingMongo()` in `server/src/config/db.js` (`admin().ping()`).
4. Success: `{ "ok": true, "mongo": "pong" }`. Failure: `503`.

Normal site traffic (notices, projects, admin) also touches MongoDB; this job covers long quiet periods.

## One-time setup (GitHub)

1. Deploy the site so `https://YOUR_DOMAIN/api/keep-alive` works.
2. In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**:

   | Secret | Example | Required |
   |--------|---------|----------|
   | `KEEP_ALIVE_URL` | `https://ynh.co.za/api/keep-alive` | Yes |
   | `CRON_SECRET` | same value as Vercel `CRON_SECRET`, if you set one | Only if the API requires it |

3. Optional on Vercel: set `CRON_SECRET` (Production env) so only authorized callers can ping. Redeploy after adding it.
4. Confirm the workflow: **Actions → MongoDB keep-alive → Run workflow**.

Scheduled runs only apply after the workflow file is on the **default branch** (usually `main`).

## Files involved

| File | Role |
|------|------|
| `.github/workflows/mongodb-keep-alive.yml` | Schedule + `curl` |
| `server/src/index.js` | `GET /api/keep-alive` |
| `server/src/config/db.js` | `pingMongo()` |

## Optional: `CRON_SECRET`

If `CRON_SECRET` is set on the **Vercel** app:

- `/api/keep-alive` requires `Authorization: Bearer <CRON_SECRET>`.
- Add the **same** value as the GitHub Actions secret `CRON_SECRET`.

If it is unset, the endpoint is public (lightweight ping only).

## Verify

```bash
curl -i https://YOUR_DOMAIN/api/keep-alive
# with secret:
curl -i -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://YOUR_DOMAIN/api/keep-alive
```

Expect `200` and `{ "ok": true, "mongo": "pong" }`.

In GitHub: **Actions** → open a keep-alive run → confirm the ping step succeeded.

## Local development

```bash
# API running (npm run dev:server)
curl http://localhost:5000/api/keep-alive
```

`/api/health` does **not** ping MongoDB.

## Alternative without GitHub Actions

Any free HTTP monitor can call the same URL on a schedule, for example [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com):

- Method: `GET`
- URL: `https://YOUR_DOMAIN/api/keep-alive`
- Interval: every 1–3 days (or daily)
- Header (if used): `Authorization: Bearer <CRON_SECRET>`

You can disable the GitHub workflow if you prefer an external service only.

## Changing the schedule

Edit the `cron:` line in `.github/workflows/mongodb-keep-alive.yml` (UTC), then merge to the default branch.

| Expression | Meaning |
|------------|---------|
| `0 0 */3 * *` | Every 3 days at 00:00 UTC (default) |
| `0 0 * * *` | Every day at 00:00 UTC |

## Related

- Deploy and env vars: [DEPLOY.md](./DEPLOY.md)
- Project overview: [README.md](./README.md)
