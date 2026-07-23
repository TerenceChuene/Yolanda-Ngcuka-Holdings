# MongoDB keep-alive (Vercel Cron)

How the app prevents a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster from pausing due to inactivity when the site is hosted on **Vercel**.

## Why this exists

Atlas free (M0) clusters can pause after a long period with no connections. On an always-on server you could ping the database on a timer. That does **not** work on Vercel:

- The app runs as a container / function that **scales to zero** when idle.
- An in-process `setInterval` dies when the instance stops.
- The next cold start creates a new process — the old timer never fires.

So keep-alive must be driven by something **outside** the Node process: **Vercel Cron**, which issues an HTTP request on a schedule and wakes the app long enough to touch MongoDB.

## How it works

```text
Vercel Cron (daily, UTC)
        │
        │  GET /api/cron/keep-alive
        │  (+ Authorization: Bearer <CRON_SECRET> if set)
        ▼
Express (server/src/index.js)
        │
        │  pingMongo()
        ▼
MongoDB Atlas  →  db.admin().ping()
```

1. **`vercel.json`** declares a cron that runs once per day at midnight UTC:

   ```json
   {
     "crons": [
       {
         "path": "/api/cron/keep-alive",
         "schedule": "0 0 * * *"
       }
     ]
   }
   ```

2. Vercel sends an HTTP **GET** to that path on the **production** deployment only (not preview).

3. The handler in `server/src/index.js` calls `pingMongo()` from `server/src/config/db.js`, which runs `admin().ping()` on the open Mongoose connection.

4. Success response: `{ "ok": true, "mongo": "pong" }`. Failure: `503` with an error message.

Daily is enough for Atlas inactivity rules and matches the **Hobby** plan limit (at most one cron run per day).

## Files involved

| File | Role |
|------|------|
| `vercel.json` | Cron path + schedule |
| `server/src/index.js` | `GET /api/cron/keep-alive` route |
| `server/src/config/db.js` | `pingMongo()` — Atlas ping |

## Optional: `CRON_SECRET`

If `CRON_SECRET` is set in the Vercel project environment:

- The keep-alive route requires `Authorization: Bearer <CRON_SECRET>`.
- Vercel Cron automatically sends that header when the secret is configured.
- Requests without a valid bearer token get `401 Unauthorized`.

If `CRON_SECRET` is **not** set, the endpoint is public (anyone can trigger a ping). That is usually fine for a lightweight ping, but setting a secret is recommended in production.

Add under **Project → Settings → Environment Variables** (Production):

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Shared secret for cron auth (long random string) |

Redeploy after adding it so the running container sees the variable.

## Verify after deploy

1. In the Vercel dashboard: **Project → Settings → Cron Jobs** — confirm `/api/cron/keep-alive` is listed and enabled.
2. Manually hit the endpoint (omit the secret header if `CRON_SECRET` is unset):

   ```bash
   curl -i https://YOUR_DOMAIN/api/cron/keep-alive
   # with secret:
   curl -i -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://YOUR_DOMAIN/api/cron/keep-alive
   ```

   Expect `200` and `{ "ok": true, "mongo": "pong" }`.
3. After a scheduled run, check **Deployments → Logs** (or Function / container logs) for a successful request and no keep-alive errors.

## Local development

Cron only runs on Vercel production. Locally you can exercise the same path:

```bash
# with API running (npm run dev:server)
curl http://localhost:5000/api/cron/keep-alive
```

`/api/health` remains a simple liveness check and does **not** ping MongoDB.

## Changing the schedule

Edit the `schedule` in `vercel.json` (cron expression, UTC), then redeploy.

- Hobby: no more than **once per day**.
- Pro: more frequent schedules are allowed if you need them.

Example every 3 days at midnight UTC (if your plan allows): `"0 0 */3 * *"`.

## Related

- Deploy and env vars: [DEPLOY.md](./DEPLOY.md)
- Project overview: [README.md](./README.md)
