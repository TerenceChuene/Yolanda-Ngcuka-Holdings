# Yolanda Ngcuka Holdings

Public marketing site with a Notice Management admin portal.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js / Express (`server/`)
- **Database:** MongoDB

## Setup

1. Start MongoDB (Docker):

```bash
docker compose up -d
```

Or use a local MongoDB instance at `mongodb://127.0.0.1:27017/ynh_notices`.

2. Configure the API (optional — defaults work for local dev):

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

Uploaded files are stored in `server/uploads/` and served at `/uploads/...`.
