import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { getLandingStats, getFeaturedUpcomingEvents } from "@/lib/data/landing";
import { StatStrip } from "@/components/stat-strip";
import { CapabilityCard } from "@/components/capability-card";
import { Reveal } from "@/components/reveal";
import { FlagIcon, TrophyIcon, UsersIcon, CalendarIcon, PulseIcon } from "@/components/icons";
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
    <section className="pitwall-grid relative overflow-hidden px-4 sm:px-6 pt-16 pb-20">
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
              href="/standings"
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

async function EventsTeaser() {
  await connection();
  const events = await getFeaturedUpcomingEvents();

  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="h-0.5 w-10 bg-accent mb-3" />
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
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
        </Reveal>

        {events.length === 0 ? (
          <p className="text-sm text-muted">Nothing scheduled yet — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {events.map((event, i) => (
              <Reveal key={event.id} delayMs={i * 80}>
                <div className="group relative overflow-hidden rounded-lg border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_40px_-14px_rgba(0,0,0,0.7)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-muted">
                      {event.sim.name}
                    </div>
                    <FlagIcon className="text-accent opacity-70" />
                  </div>
                  <div className="mt-2 font-display text-lg font-semibold">{event.title}</div>
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
              </Reveal>
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
        <Reveal>
          <div className="h-0.5 w-10 bg-accent mb-3" />
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight mb-8">
            What SRM is
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-4">
          <Reveal>
            <CapabilityCard index="01" label="EVENTS" title="Races every week" icon={<FlagIcon />}>
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
            >
              Open to any Moroccan sim racer, from first lap to podium regular.
            </CapabilityCard>
          </Reveal>
        </div>
      </div>
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
            href="/overview"
            className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-raised transition-colors active:scale-95"
          >
            See the Community
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
