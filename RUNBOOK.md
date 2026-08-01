# Apollonia Events — operations runbook

Everything needed to keep the live site working, and what to do when it
doesn't. Written 2026-08-01; the failure modes below are ones that actually
happened, not hypotheticals.

- **Live:** https://www.apolloniaevents.com (the apex 308-redirects to `www` —
  always use `www` for monitors and links)
- **Hosting:** Vercel, project `apollonia-events`, Hobby plan
- **Database:** Neon Postgres, endpoint `ep-divine-cloud-asiz18y0`, Frankfurt
- **Images:** Cloudinary, cloud `ejtikldj`, folder `apollonia/gallery`
- **Errors:** Sentry (`apollonia-events` / `javascript-nextjs`)
- **Uptime:** UptimeRobot

---

## 1. Health check

```
https://www.apolloniaevents.com/api/health
```

```json
{
  "status": "ok",
  "database": "ok",
  "databaseLatencyMs": 93,
  "commit": "936880b",
  "environment": "production"
}
```

- Returns **503** when Postgres is unreachable, **200** otherwise.
- `commit` tells you which build is actually serving — useful for confirming a
  deploy landed.
- Add `?token=<CRON_SECRET>` for a `config` block showing which integrations
  are wired. It is withheld from anonymous callers on purpose: an endpoint that
  freely lists unconfigured integrations is a map for anyone probing.

### Why not just monitor the homepage

`/` is statically generated and served from Vercel's CDN. **It returns 200 even
when the database is completely down.** That happened three times on
2026-08-01. A green homepage monitor would have reported everything fine while
nobody could book. Monitor `/api/health` instead.

---

## 2. Monitors

| Monitor | URL                                          | Type                                   |
| ------- | -------------------------------------------- | -------------------------------------- |
| Health  | `https://www.apolloniaevents.com/api/health` | Keyword — must contain `"status":"ok"` |
| Booking | `https://www.apolloniaevents.com/reserve`    | HTTP 200                               |

`/reserve` is the only public page that must render dynamically for the
business to work, so it is the second most valuable thing to watch.

Do **not** point monitors at the apex domain — they will measure a 308 redirect
rather than the app.

---

## 3. Environment variables

Set in Vercel → Settings → Environment Variables. Tick **Production and
Preview**: preview deploys prerender the same pages and fail without a
database.

| Variable                                           | Needed for              | If missing                                                    |
| -------------------------------------------------- | ----------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`                                     | everything              | **build fails** — `/` and `/gallery` query at build time      |
| `DIRECT_URL`                                       | migrations / `db push`  | schema commands hit the wrong database                        |
| `AUTH_SECRET`                                      | admin login             | `/api/auth/session` 500s, nobody can log in                   |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`                    | seeding the admin user  | `pnpm db:seed` cannot run                                     |
| `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET` | gallery + admin upload  | uploads throw, gallery falls back to placeholders             |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`                | client upload widget    | falls back to the server value                                |
| `CRON_SECRET`                                      | daily reminder cron     | **cron 401s silently every morning — no reminders sent**      |
| `RESEND_API_KEY`, `EMAIL_FROM`                     | all transactional email | **every email silently skipped** — guests get no confirmation |
| `ADMIN_NOTIFY_EMAIL`                               | owner notifications     | falls back to `ADMIN_EMAIL`                                   |
| `NEXT_PUBLIC_SITE_URL`                             | metadata / OG images    | defaults to `https://apollonia.events`                        |

`DATABASE_URL` and `DIRECT_URL` must be the **same** Neon database, differing
only by `-pooler` in the host. Pooled for the app (serverless opens and closes
connections constantly), direct for schema work.

Local secrets live in `.env`, which is gitignored, as is
`.env.sentry-build-plugin`.

---

## 4. Deploying

Pushing to `main` deploys production. There are no migrations — the schema is
applied with `prisma db push`, so **schema changes must be pushed manually
before deploying**:

```bash
pnpm db:push
```

Confirm what is live:

```bash
curl -s https://www.apolloniaevents.com/api/health
```

---

## 5. Failure modes

### "Can't reach database server"

Neon's free tier scales to zero. Cold starts usually resolve in seconds, but on
2026-08-01 the endpoint was genuinely unreachable for several minutes — both
pooled and direct, while TCP 5432 still connected — and recovered on its own
with no data lost.

The public pages survive this: `getPublicGalleryImages`
(`src/server/gallery-read.ts`) and the availability lookups log and return
empty rather than throwing, so the site degrades to placeholder tiles instead
of an error page. Verified by building against a dead URL:

```bash
DATABASE_URL="postgresql://u:p@127.0.0.1:1/none" pnpm build   # must reach 21/21
```

`/reserve` submission and `/admin` still need the database. If health reports
`degraded`, check the Neon console before changing anything.

### Build fails at prerender

Almost always the database. `/` and `/gallery` query at build time. Check
`DATABASE_URL` in Vercel points at `ep-divine-cloud-asiz18y0-pooler`.

### Gallery images blank or slow

- **Blank on retina only:** an image asking for a width larger than the 2560px
  source makes Cloudinary upscale — slow and wasteful. `deviceSizes` in
  `next.config.ts` is capped at 2048 for this reason. Do not raise it.
- **Blank at some sizes but not others:** a `fill` image inside a parent with no
  resolved height renders at 0×0. It decodes fine, so `naturalWidth > 0` is
  **not** proof it is visible — measure the rendered rect.
- **Slow on first view:** Cloudinary derives each new size on demand. The first
  person to open a newly uploaded photo waits a few seconds; it is cached after.

### Emails not arriving

`sendEmail` returns `{ skipped: true }` and logs a warning when
`RESEND_API_KEY` or `EMAIL_FROM` is unset. Nothing throws — check the function
logs rather than waiting for an error.

### Reminder cron not firing

`vercel.json` runs `/api/cron/reminders` daily at 09:00. It returns 401 without
a matching `CRON_SECRET`, so an unset secret means it runs and does nothing,
silently. Test:

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" https://www.apolloniaevents.com/api/cron/reminders
```

---

## 6. Rate limiting

Postgres-backed (`RateLimitHit`), because serverless instances share no memory
and a per-process counter is defeated by concurrent requests.

| Action                 | Limit       |
| ---------------------- | ----------- |
| Reservation, per IP    | 5 / hour    |
| Reservation, per email | 3 / day     |
| Login, per email       | 8 / 15 min  |
| Login, per IP          | 20 / 15 min |

It **fails open**: if the database is unreachable the request is allowed and the
failure logged. Losing rate limiting during an outage beats nobody being able
to book or log in.

Spent rows are pruned by the daily cron. To lift a limit for someone locked out:

```sql
DELETE FROM "RateLimitHit" WHERE bucket LIKE 'login:email:%their@email%';
```

---

## 7. Gallery

The site reads the `GalleryImage` table, **not** whatever is in Cloudinary.
Uploading through the Cloudinary console creates no row and the photo will
never appear. Always upload via `/admin/gallery`.

`sortOrder` drives everything: image 0 is the hero on `/`, the next three fill
the home strip, and `/venue` takes the first four. Reordering in the admin
panel changes the hero — no code change needed.

Originals were downscaled to 2560px long edge before upload; anything larger
wastes Cloudinary credits and, on the free tier, uploads over 10MB are rejected.

---

## 8. Known gaps

- **Neon history retention is 6 hours.** That is the entire point-in-time
  restore window for real bookings. A `pg_dump` somewhere off Neon is the
  cheapest insurance and is not yet set up.
- **Vercel Hobby is non-commercial** per Vercel's terms. A venue taking
  bookings is commercial use.
- **No analytics.** There is no data on which pages people visit or where they
  abandon the booking flow. Vercel Web Analytics is free on Hobby.
- **Booking blocks the whole date.** `isConfirmedDate`
  (`src/server/reservations.ts`) rejects any date with a confirmed reservation,
  so the site cannot sell the second event of a day even though the venue runs
  up to two. Pending the owner's answers on day/evening blocks.
