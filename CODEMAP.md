# Code Map

Navigation index: every source file and its functions/exports, so an edit
can go straight to the right spot instead of a full read-through. Stale the
moment files move — regenerate by asking for a re-index after any
structural change (new files, renamed exports, moved routes).

## Routes (`app/`)

- `app/layout.tsx` — `RootLayout({children})` (default export): html shell,
  loads Geist Sans/Mono + Rajdhani (`--font-display`) fonts, renders
  `<Nav/>` + footer. Also exports `metadata`, `viewport` (theme-color).
- `app/page.tsx` — Landing page, route `/`. Default `LandingPage()`.
  Internal: `Hero()` (cockpit bg image, live badge, headline, CTAs),
  `Stats()` / `StatStripSkeleton()` (stat strip via `getLandingStats`),
  `EventsTeaser()` / `EventsTeaserSkeleton()` (via `getFeaturedUpcomingEvents`),
  `Capabilities()` (3 `CapabilityCard`s with images), `ClosingCta()`.
- `app/overview/page.tsx` — route `/overview`. Default `Page()`: renders
  `<PageBanner>` + `<Overview/>`. Internal: `Overview()` (async, calls
  `getOverview`), `OverviewSkeleton()`.
- `app/standings/page.tsx` — route `/standings`. Default `StandingsPage()`.
  Internal: `Standings()` (async, calls `getStandings`), `StandingsSkeleton()`.
- `app/events/page.tsx` — route `/events`. Default `EventsPage()`. Internal:
  `Events()` (async, `getUpcomingEvents` + `getPastEvents`), `EventList()`
  (shared renderer for both lists), `EventsSkeleton()`. Type `EventRow`.
- `app/api/sync/route.ts` — `POST()`: triggers `runSync()`. Not yet wired to
  a schedule (add Vercel Cron once `discordBotSource` is real).
- `app/globals.css` — theme tokens (`--background`, `--surface`, `--accent`,
  `--positive`, `--border`, `--muted`, `--font-display`, etc.),
  `.pitwall-grid` texture (decorative `::before`, see its comment before
  reusing — don't apply the class to a content-bearing element directly),
  `.glow-accent`, `.text-glow-accent`, `fade-up` keyframes / `.animate-fade-up`.

## Components (`components/`)

- `nav.tsx` — `Nav()`: sticky header, logo + "Sim Racing Morocco" wordmark,
  desktop links, mobile hamburger menu (client component, `useState`).
  Internal: `NavLink()`, `MenuIcon()`, `CloseIcon()`. Reads `DISCORD_URL`.
- `stat-card.tsx` — `StatCard({label, value, sub?, icon?, accent?})`:
  dashboard stat tile, top accent bar, `CountUp` number, hover lift.
- `stat-strip.tsx` — `StatStrip({stats})`: landing 4-col stat row, icons +
  `CountUp`, `.pitwall-grid` texture.
- `capability-card.tsx` — `CapabilityCard({index, label, title, icon, accent?, image?, children})`:
  landing "what SRM is" card; `image` renders as a darkened background photo.
- `page-banner.tsx` — `PageBanner({image, title, subtitle})`: dashboard
  masthead banner (bg image + gradient + page title), used by
  overview/standings/events.
- `sync-status.tsx` — `SyncStatus({lastSyncAt})`: "data updated Xm ago" dot
  indicator. Internal `relativeTime()`.
- `reveal.tsx` — `Reveal({children, className?, delayMs?})`: client,
  IntersectionObserver scroll-fade-in, respects `prefers-reduced-motion`.
- `count-up.tsx` — `CountUp({value, durationMs?})`: client, animates a
  number up on scroll-into-view, respects reduced motion.
- `icons.tsx` — hand-authored SVG icon set: `FlagIcon`, `TrophyIcon`,
  `UsersIcon`, `CalendarIcon`, `PulseIcon`. No icon library dependency.

## Data layer (`lib/`)

- `db.ts` — `db`: Prisma client singleton (dev-mode global cache). Internal
  `createClient()` (wires the `@prisma/adapter-better-sqlite3` driver).
- `constants.ts` — `DISCORD_URL` — **placeholder `"#"`, needs the real
  invite link.**
- `data/overview.ts` — `getOverview()`: member/active-member counts,
  upcoming events, recent results, last successful sync — powers `/overview`.
- `data/standings.ts` — `getStandings()`: aggregates `Result` rows per
  member into starts/wins/podiums/top5/fastestLaps/points, sorted by points.
  Type `StandingRow`.
- `data/events.ts` — `getUpcomingEvents()`, `getPastEvents()` — used by `/events`.
- `data/landing.ts` — `getLandingStats()` (counts for the hero stat strip),
  `getFeaturedUpcomingEvents()` (top 3, for the landing teaser).
- `ingestion/types.ts` — the normalized ingestion contract: `RawMember`,
  `RawEvent`, `RawResult`, `CommunitySnapshot`, `CommunitySource`. Any new
  data source must produce these shapes.
- `ingestion/discordBotSource.ts` — `discordBotSource: CommunitySource` —
  **stub, throws on call.** This is the one file to fill in once Person A's
  bot access lands.
- `ingestion/sync.ts` — `runSync(source?)`: fetch → upsert (Member/Sim/Event/Result)
  → `SyncLog`. Called by `app/api/sync/route.ts`.

## Data model (`prisma/`)

- `schema.prisma` — models `Member`, `Sim`, `Event`, `Result`, `SyncLog`;
  enums `EventStatus`, `SyncStatus`. SQLite for dev; swap to Postgres before
  deploy (see README "Moving to Supabase").
- `seed.ts` — `main()`: seeds 10 fake members, 2 sims (Assetto Corsa, Le Mans
  Ultimate), 2 completed + 2 upcoming events, results, one `SyncLog`.
- `migrations/20261105123629_init/` — the one migration so far.

## Config (repo root)

- `next.config.ts` — `cacheComponents: true`, `partialPrefetching: true`,
  Tailwind-via-Turbopack loader rule.
- `prisma.config.ts` — Prisma 7 config (schema path, seed command,
  `DATABASE_URL` from env — connection URL no longer lives in schema.prisma).
- `.env` / `.env.example` — `DATABASE_URL` (sqlite locally).
- `package.json` scripts — `dev`, `build`, `start`, `lint`, `db:migrate`,
  `db:seed`, `db:studio`.

## Assets (`public/`)

- `brand/srm-logo.jpg` — community logo, used in `nav.tsx`.
- `images/cockpit.webp` — landing hero background + `/overview` banner.
- `images/gt3-porsche-action.webp` — "Standings" capability card + `/standings` banner.
- `images/gt3-bmw-action.webp` — "Events" capability card.
- `images/e30-convoy.webp` — "Community" capability card + `/events` banner.
  **Licensing unverified on the last three** — they're in-sim screenshots
  showing real Porsche/BMW M Motorsport/WRT/Goodyear liveries and sponsor
  branding. Source/license unverified; using real team branding publicly
  risks reading as an implied endorsement that doesn't exist. `cockpit.webp`
  is lower-risk (no visible branding) but also unverified. Replace with
  confirmed-licensed or brand-neutral images before a real domain, press
  contact, or sponsor conversation.

## Development

```bash
npm install
npm run db:migrate   # applies prisma/migrations against local dev.db
npm run db:seed      # fills it with fake members/events/results
npm run dev
```

Open http://localhost:3000. `npm run db:studio` opens Prisma Studio to
browse/edit the local DB directly.

### Moving to Supabase before deploy

1. Create a free Supabase project, grab its Postgres connection string
   (Project Settings → Database → Connection string → URI).
2. In `prisma/schema.prisma`, change the datasource to
   `provider = "postgresql"`.
3. In `.env`, set `DATABASE_URL` to the Supabase connection string.
4. In `lib/db.ts` and `prisma/seed.ts`, swap `PrismaBetterSqlite3` for the
   Postgres adapter (`@prisma/adapter-pg` or similar) — same pattern, new
   adapter.
5. `rm -rf prisma/migrations && npx prisma migrate dev --name init`
6. `npm run db:seed` (or wait for the real sync once bot access lands).

## Known gaps

- `lib/ingestion/discordBotSource.ts` is a stub — real data is blocked on
  Person A's bot access.
- `lib/constants.ts`'s `DISCORD_URL` is a placeholder.
- No test suite yet.
- Dashboard currently renders against seeded fake data (see `prisma/seed.ts`);
  real data depends on `discordBotSource` — see "The Assignment" in
  `../design-doc-portal.md`.
