# SEO Optimisation — Yolanda Ngcuka Holdings

This document explains the search-engine and social-preview setup for the marketing site, what was implemented, and how to maintain it after deploy.

## Goals

- Make public pages discoverable with clear titles, descriptions, and keywords.
- Provide correct previews when links are shared (WhatsApp, LinkedIn, Facebook, X).
- Help Google understand the business via structured data (JSON-LD).
- Keep admin and API surfaces out of search results.
- Give crawlers a sitemap and robots policy.

## What was implemented

| Area | Location | Purpose |
|------|----------|---------|
| Static meta (fallback) | `index.html` | Title, description, canonical, Open Graph, Twitter, JSON-LD available before React loads |
| Per-route meta | `src/seo/` + `react-helmet-async` | Unique title/description/canonical per path; `noindex` on `/admin` |
| Crawl rules | `public/robots.txt` | Allows public pages; blocks `/admin`, `/api`, `/uploads` |
| Sitemap | `public/sitemap.xml` | Lists `/`, `/about`, `/services`, `/team`, `/projects`, `/contact` |
| Social image | `public/og-image.png` (1200×630) | Default share image for Open Graph / Twitter |
| Brand logo (absolute URL) | `public/logo.png` | Used in schema.org `logo` |
| Site origin config | `src/seo/config.ts` + `VITE_SITE_URL` | Canonical / OG / JSON-LD absolute URLs |

## Architecture notes

This is a **Vite + React SPA**. Crawlers that execute JavaScript see updated Helmet tags after hydration. Static tags in `index.html` and files under `public/` remain the primary signal for bots and link unfurlers that only read the first HTML response.

For stronger indexing of every route’s unique body content, consider prerendering or SSR later (e.g. Vite SSR or a static prerender plugin). The current setup is the right baseline for an SPA.

## Per-route titles

| Path | Title pattern |
|------|----------------|
| `/` | Yolanda Ngcuka Holdings \| Environmental Consulting for Mining |
| `/about` | About Us \| Yolanda Ngcuka Holdings |
| `/services` | Services \| Yolanda Ngcuka Holdings |
| `/team` | Our Team \| Yolanda Ngcuka Holdings |
| `/projects` | Projects \| Yolanda Ngcuka Holdings |
| `/contact` | Contact \| Yolanda Ngcuka Holdings |
| `/admin/*` | Admin… + `noindex, nofollow` |

Edit copy in `src/seo/pages.ts` and the matching fallbacks in `index.html` when messaging changes.

## Production domain checklist

Before go-live, align the public origin everywhere:

1. Set build env:

```bash
# .env or Vercel project env
VITE_SITE_URL=https://your-production-domain.co.za
```

2. Replace `https://ynh.co.za` in:

- `index.html` (canonical, `og:url`, `og:image`, Twitter image, JSON-LD)
- `public/robots.txt` (`Sitemap:`)
- `public/sitemap.xml` (every `<loc>`)
- Default fallback in `src/seo/config.ts` (optional if `VITE_SITE_URL` is always set at build)

3. Set API CORS to the same origin:

```bash
CLIENT_ORIGIN=https://your-production-domain.co.za
```

The default `ynh.co.za` matches the admin email domain in `server/.env.example`; change it if the live hostname differs.

## Verification after deploy

1. **View source** on the homepage — confirm title, description, OG tags, and JSON-LD.
2. **robots / sitemap**
   - `https://your-domain/robots.txt`
   - `https://your-domain/sitemap.xml`
3. **Social previews**
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - WhatsApp: paste the URL in a chat and check the card
4. **Rich results**
   - [Google Rich Results Test](https://search.google.com/test/rich-results) with the homepage URL
5. **Search Console**
   - Add the property, submit `sitemap.xml`, request indexing for key URLs

## Maintaining SEO

- **New public page:** add an entry in `src/seo/pages.ts` and a `<url>` in `public/sitemap.xml`.
- **Admin-only route:** ensure path starts with `/admin` (already `noindex`) or set `noIndex: true` in `pages.ts`.
- **New OG image:** replace `public/og-image.png` (keep ~1200×630); purge social caches after deploy.
- **Keywords / business facts:** update `src/seo/config.ts` and the JSON-LD blocks in `Seo.tsx` / `index.html`.

## Limits of this SPA setup

- Unique **on-page** copy for `/about`, `/services`, etc. is rendered client-side; some crawlers may weight the shared `index.html` shell more heavily than a fully prerendered site.
- Hash sections on the home page (`/#about`) are not separate URLs in the sitemap; dedicated routes (`/about`, …) are preferred for SEO and are already listed.
- Do not expect `/admin` or uploaded notice files under `/uploads` to rank — they are disallowed in `robots.txt`.
