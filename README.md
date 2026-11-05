# SRM Portal

Public-facing dashboards for Sim Racing Morocco: member activity, standings,
and events. Read-only by design — see `../design-doc-portal.md` for why.

## Stack

Next.js (App Router, Cache Components) + Prisma + SQLite for local dev,
swappable to Supabase Postgres for deploy.

## Getting started

```bash
npm install
npm run db:migrate   # applies prisma/migrations against local dev.db
npm run db:seed      # fills it with fake members/events/results
npm run dev
```

Open http://localhost:3000.

`npm run db:studio` opens Prisma Studio if you want to browse/edit the local
DB directly.

## Project shape

- `prisma/schema.prisma` — data model (Member, Sim, Event, Result, SyncLog)
- `lib/db.ts` — Prisma client singleton (driver-adapter based, Prisma 7)
- `lib/data/*.ts` — read-only query helpers the pages call
- `lib/ingestion/` — the sync boundary. `types.ts` defines the normalized
  shape any data source must produce; `discordBotSource.ts` is the (not yet
  implemented) adapter for Person A's bot; `sync.ts` orchestrates
  fetch → upsert → `SyncLog`. Nothing outside this folder should ever know
  Discord/bot-specific details — that's what keeps the portal itself stable
  if the bot's data format changes.
- `app/api/sync/route.ts` — POST endpoint that triggers a sync run. Not wired
  to a schedule yet; add a Vercel Cron entry once `discordBotSource` is real.

## Moving to Supabase before deploy

1. Create a free Supabase project, grab its Postgres connection string
   (Project Settings → Database → Connection string → URI).
2. In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
3. In `.env`, set `DATABASE_URL` to the Supabase connection string.
4. In `lib/db.ts` and `prisma/seed.ts`, swap `PrismaBetterSqlite3` for the
   Postgres adapter (`@prisma/adapter-pg` or similar) — same pattern, new
   adapter.
5. `rm -rf prisma/migrations && npx prisma migrate dev --name init`
6. `npm run db:seed` (or wait for the real sync once bot access lands).

## Status

Dashboard renders against seeded fake data. Real data depends on
`discordBotSource` being implemented once Person A's bot access is in hand —
see "The Assignment" in the design doc.
