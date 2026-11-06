import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { getLandingStats } from "@/lib/data/landing";
import { getOverview } from "@/lib/data/overview";
import { getStandings } from "@/lib/data/standings";
import { getUpcomingEvents, getPastEvents } from "@/lib/data/events";
import { StatStrip } from "@/components/stat-strip";
import { StatCard } from "@/components/stat-card";
import { CapabilityCard } from "@/components/capability-card";
import { SyncStatus } from "@/components/sync-status";
import { Reveal } from "@/components/reveal";
import {
  FlagIcon,
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
  PulseIcon,
} from "@/components/icons";
import { DISCORD_URL } from "@/lib/constants";
import cockpitImage from "@/public/images/cockpit.webp";
import porscheAction from "@/public/images/gt3-porsche-action.webp";
import bmwAction from "@/public/images/gt3-bmw-action.webp";
import e30Convoy from "@/public/images/e30-convoy.webp";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Suspense fallback={<StatStripSkeleton />}>
        <Stats />
      </Suspense>
      <Capabilities />
      <Suspense fallback={<EventsSkeleton />}>
        <Events />
      </Suspense>
      <Suspense fallback={<OverviewSkeleton />}>
        <Overview />
      </Suspense>
      <Suspense fallback={<StandingsSkeleton />}>
        <Standings />
      </Suspense>
      <ClosingCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="pitwall-grid relative overflow-hidden px-4 sm:px-6 pt-16 pb-20">
      {/* Cockpit photo, heavily darkened so it reads as atmosphere, not a
          competing focal point — the headline still has to win. */}
      <div className="absolute inset-0">
        <Image
          src={cockpitImage}
          alt=""
          fill
          priority
          className="object-cover object-[30%_30%] opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>
      {/* Radial glow behind the headline, echoing the logo's accent red */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      {/* Diagonal stripes echoing the SRM logo's red/green mark */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-25">
        <div className="absolute right-10 top-0 h-full w-3 -skew-x-12 bg-accent" />
        <div className="absolute right-20 top-0 h-full w-3 -skew-x-12 bg-positive" />
        <div className="absolute right-32 top-0 h-full w-3 -skew-x-12 bg-foreground/40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-mono tracking-[0.15em] text-muted uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positive" />
            </span>
            Sim Racing Morocco — live
          </div>
        </Reveal>
        <Reveal delayMs={80}>
          <h1 className="mt-5 font-display text-5xl sm:text-7xl font-bold uppercase tracking-tight leading-[0.95]">
            Morocco&apos;s home for
            <br />
            <span className="text-accent text-glow-accent">sim racing.</span>
          </h1>
        </Reveal>
        <Reveal delayMs={160}>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-muted leading-relaxed">
            Assetto Corsa and Le Mans Ultimate racing, run by the community —
            events, standings, and a place for Morocco&apos;s sim racing talent
            to be seen.
          </p>
        </Reveal>
        <Reveal delayMs={240}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={DISCORD_URL}
              className="glow-accent rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform motion-safe:hover:scale-[1.03] active:scale-95"
            >
              Join the Discord
            </Link>
            <Link
              href="#standings"
              className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface-raised transition-colors active:scale-95"
            >
              View Live Standings
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

async function Stats() {
  await connection();
  const stats = await getLandingStats();

  return (
    <Reveal>
      <StatStrip
        stats={[
          { label: "Members", value: stats.memberCount, icon: <UsersIcon /> },
          { label: "Events run", value: stats.eventsRun, icon: <FlagIcon /> },
          { label: "Upcoming races", value: stats.upcomingCount, icon: <CalendarIcon /> },
          { label: "Race entries", value: stats.raceEntries, icon: <TrophyIcon /> },
        ]}
      />
    </Reveal>
  );
}

function StatStripSkeleton() {
  return <div className="h-24 border-y border-border bg-surface animate-pulse" />;
}

function Capabilities() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-surface/40">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="h-0.5 w-10 bg-accent mb-3" />
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight mb-8">
            What SRM is
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-4">
          <Reveal>
            <CapabilityCard
              index="01"
              label="EVENTS"
              title="Races every week"
              icon={<FlagIcon />}
              image={bmwAction}
            >
              Assetto Corsa and Le Mans Ultimate events, organized by the
              community through Discord.
            </CapabilityCard>
          </Reveal>
          <Reveal delayMs={100}>
            <CapabilityCard
              index="02"
              label="STANDINGS"
              title="Transparent results"
              icon={<TrophyIcon />}
              accent="positive"
              image={porscheAction}
            >
              Every result feeds public standings — wins, podiums, and
              consistency, not just a scoreboard.
            </CapabilityCard>
          </Reveal>
          <Reveal delayMs={200}>
            <CapabilityCard
              index="03"
              label="COMMUNITY"
              title="Morocco's grid"
              icon={<UsersIcon />}
              accent="foreground"
              image={e30Convoy}
            >
              Open to any Moroccan sim racer, from first lap to podium regular.
            </CapabilityCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Reveal>
      <div className="h-0.5 w-10 bg-accent mb-3" />
      <h2 className="font-display text-3xl font-bold uppercase tracking-tight">{title}</h2>
      <p className="text-sm text-muted mt-1">{subtitle}</p>
    </Reveal>
  );
}

type EventRow = {
  id: string;
  title: string;
  trackName: string | null;
  startAt: Date;
  sim: { name: string };
  results: { id: string }[];
};

async function Events() {
  // "Upcoming" is relative to request time, so this section renders at
  // request time rather than being cached — see the Overview comment below.
  await connection();
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <section id="events" className="scroll-mt-20 px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-10">
        <SectionHeader title="Events" subtitle="Upcoming and past community races." />
        <EventList
          title="Upcoming"
          events={upcoming}
          emptyText="Nothing scheduled yet."
          variant="upcoming"
        />
        <EventList
          title="Past"
          events={past}
          emptyText="No past events recorded yet."
          variant="past"
        />
      </div>
    </section>
  );
}

function EventList({
  title,
  events,
  emptyText,
  variant,
}: {
  title: string;
  events: EventRow[];
  emptyText: string;
  variant: "upcoming" | "past";
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">{title}</h3>
      {events.length === 0 ? (
        <p className="text-sm text-muted">{emptyText}</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {events.map((event, i) => (
            <Reveal key={event.id} delayMs={i * 80}>
              <EventCard event={event} variant={variant} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, variant }: { event: EventRow; variant: "upcoming" | "past" }) {
  const isUpcoming = variant === "upcoming";
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_40px_-14px_rgba(0,0,0,0.7)]">
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${isUpcoming ? "bg-accent" : "bg-foreground/40"} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
      />
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted">{event.sim.name}</div>
        {isUpcoming ? (
          <CalendarIcon className="text-accent opacity-70" />
        ) : (
          <FlagIcon className="text-muted opacity-70" />
        )}
      </div>
      <div className="mt-2 font-display text-lg font-semibold">{event.title}</div>
      {event.trackName && <div className="mt-1 text-sm text-muted">{event.trackName}</div>}
      <div
        className={`mt-4 text-sm font-medium tabular-nums ${isUpcoming ? "text-accent" : "text-muted"}`}
      >
        {event.startAt.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        {!isUpcoming && event.results.length > 0 && ` — ${event.results.length} entrants`}
      </div>
    </div>
  );
}

function EventsSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 rounded-lg border border-border bg-surface" />
        ))}
      </div>
    </section>
  );
}

async function Overview() {
  // This data changes between requests (member activity is relative to
  // "now") and is cheap to compute, so render it at request time rather
  // than caching it. See lib/data/overview.ts.
  await connection();
  const overview = await getOverview();

  return (
    <section id="overview" className="scroll-mt-20 px-4 sm:px-6 py-16 bg-surface/40">
      <div className="max-w-6xl mx-auto space-y-6">
        <SectionHeader
          title="Community Overview"
          subtitle="Sim Racing Morocco — a live pulse on who's active and who just raced."
        />
        <SyncStatus lastSyncAt={overview.lastSyncAt} />

        <div className="max-w-xs">
          <StatCard
            label="Active members"
            value={overview.activeMemberCount}
            sub={`last ${overview.activeWindowDays} days`}
            icon={<PulseIcon />}
            accent="positive"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
            Recent results
          </h3>
          {overview.recentResults.length === 0 ? (
            <p className="text-sm text-muted">No results recorded yet.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
              {overview.recentResults.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-3 flex items-center justify-between transition-colors hover:bg-surface-raised"
                >
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="text-muted shrink-0" />
                    <div>
                      <span className="font-medium">{result.member.displayName}</span>
                      <span className="text-muted"> finished P{result.position} in </span>
                      <span>{result.event.title}</span>
                    </div>
                  </div>
                  {result.fastestLap && (
                    <span className="text-xs text-accent font-medium shrink-0">Fastest lap</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-surface/40">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-3 w-40 bg-surface rounded" />
        <div className="h-24 w-64 rounded-lg border border-border bg-surface" />
        <div className="h-40 rounded-lg border border-border bg-surface" />
      </div>
    </section>
  );
}

async function Standings() {
  const rows = await getStandings();

  return (
    <section id="standings" className="scroll-mt-20 px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <SectionHeader
          title="Standings"
          subtitle="Across all completed events. Ratios matter as much as points."
        />
        {rows.length === 0 ? (
          <p className="text-sm text-muted">No completed events yet.</p>
        ) : (
          <Reveal>
            <div className="relative overflow-hidden overflow-x-auto rounded-lg border border-border bg-surface">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium text-right">Starts</th>
                    <th className="px-4 py-3 font-medium text-right">Wins</th>
                    <th className="px-4 py-3 font-medium text-right">Podiums</th>
                    <th className="px-4 py-3 font-medium text-right">Top 5</th>
                    <th className="px-4 py-3 font-medium text-right">FL</th>
                    <th className="px-4 py-3 font-medium text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const rank = i + 1;
                    const podium = rank <= 3;
                    return (
                      <tr
                        key={row.memberId}
                        className="border-b border-border last:border-0 transition-colors hover:bg-surface-raised"
                      >
                        <td
                          className={`px-4 py-3 tabular-nums ${podium ? "font-display text-lg font-bold text-accent" : "text-muted"}`}
                        >
                          {rank}
                        </td>
                        <td className="px-4 py-3 font-medium">{row.displayName}</td>
                        <td className="px-4 py-3 text-right text-muted tabular-nums">{row.starts}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.wins}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.podiums}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.top5}</td>
                        <td className="px-4 py-3 text-right text-accent tabular-nums">{row.fastestLaps}</td>
                        <td className="px-4 py-3 text-right font-display font-bold tabular-nums">
                          {row.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function StandingsSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto h-80 rounded-lg border border-border bg-surface animate-pulse" />
    </section>
  );
}

function ClosingCta() {
  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 py-20 text-center border-t border-border"
      style={{
        background:
          "radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 12%, var(--background)), var(--background) 70%)",
      }}
    >
      <Reveal className="relative">
        <PulseIcon className="mx-auto text-accent" />
        <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight">
          Your grid. <span className="text-accent">Your seat.</span>
        </h2>
        <p className="mt-3 text-muted">
          Jump into the Discord and catch the next event.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={DISCORD_URL}
            className="glow-accent rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform motion-safe:hover:scale-[1.03] active:scale-95"
          >
            Join the Discord
          </Link>
          <Link
            href="#overview"
            className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-raised transition-colors active:scale-95"
          >
            See the Community
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
