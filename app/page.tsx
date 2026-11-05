import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { getLandingStats, getFeaturedUpcomingEvents } from "@/lib/data/landing";
import { StatStrip } from "@/components/stat-strip";
import { CapabilityCard } from "@/components/capability-card";
import { DISCORD_URL } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Suspense fallback={<StatStripSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<EventsTeaserSkeleton />}>
        <EventsTeaser />
      </Suspense>
      <Capabilities />
      <ClosingCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-16 pb-20">
      {/* Diagonal stripes echoing the SRM logo's red/green mark */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-20">
        <div className="absolute right-10 top-0 h-full w-3 -skew-x-12 bg-accent" />
        <div className="absolute right-20 top-0 h-full w-3 -skew-x-12 bg-positive" />
        <div className="absolute right-32 top-0 h-full w-3 -skew-x-12 bg-foreground/40" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-xs font-mono tracking-[0.2em] text-muted uppercase">
          Sim Racing Morocco
        </div>
        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold uppercase tracking-tight leading-[1.05]">
          Morocco&apos;s home for
          <br />
          <span className="text-accent">sim racing.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base sm:text-lg text-muted leading-relaxed">
          Assetto Corsa and Le Mans Ultimate racing, run by the community —
          events, standings, and a place for Morocco&apos;s sim racing talent
          to be seen.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={DISCORD_URL}
            className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110 transition-[filter]"
          >
            Join the Discord
          </Link>
          <Link
            href="/standings"
            className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface-raised transition-colors"
          >
            View Live Standings
          </Link>
        </div>
      </div>
    </section>
  );
}

async function Stats() {
  await connection();
  const stats = await getLandingStats();

  return (
    <StatStrip
      stats={[
        { label: "Members", value: stats.memberCount },
        { label: "Events run", value: stats.eventsRun },
        { label: "Upcoming races", value: stats.upcomingCount },
        { label: "Race entries", value: stats.raceEntries },
      ]}
    />
  );
}

function StatStripSkeleton() {
  return <div className="h-24 border-y border-border bg-surface animate-pulse" />;
}

async function EventsTeaser() {
  await connection();
  const events = await getFeaturedUpcomingEvents();

  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="h-0.5 w-10 bg-accent mb-3" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              Races happening soon
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors shrink-0"
          >
            Browse all events &rarr;
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="text-sm text-muted">Nothing scheduled yet — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <div className="text-xs uppercase tracking-wide text-muted">
                  {event.sim.name}
                </div>
                <div className="mt-2 font-semibold">{event.title}</div>
                {event.trackName && (
                  <div className="mt-1 text-sm text-muted">{event.trackName}</div>
                )}
                <div className="mt-4 text-sm text-accent font-medium">
                  {event.startAt.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EventsTeaserSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-lg border border-border bg-surface" />
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-surface/40">
      <div className="max-w-6xl mx-auto">
        <div className="h-0.5 w-10 bg-accent mb-3" />
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">
          What SRM is
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <CapabilityCard index="01" label="EVENTS" title="Races every week">
            Assetto Corsa and Le Mans Ultimate events, organized by the
            community through Discord.
          </CapabilityCard>
          <CapabilityCard index="02" label="STANDINGS" title="Transparent results">
            Every result feeds public standings — wins, podiums, and
            consistency, not just a scoreboard.
          </CapabilityCard>
          <CapabilityCard index="03" label="COMMUNITY" title="Morocco's grid">
            Open to any Moroccan sim racer, from first lap to podium regular.
          </CapabilityCard>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="px-4 sm:px-6 py-20 text-center border-t border-border">
      <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
        Your grid. <span className="text-accent">Your seat.</span>
      </h2>
      <p className="mt-3 text-muted">
        Jump into the Discord and catch the next event.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={DISCORD_URL}
          className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110 transition-[filter]"
        >
          Join the Discord
        </Link>
        <Link
          href="/overview"
          className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-raised transition-colors"
        >
          See the Community
        </Link>
      </div>
    </section>
  );
}
