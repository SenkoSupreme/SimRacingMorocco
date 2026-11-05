import { Suspense } from "react";
import { connection } from "next/server";
import { getOverview } from "@/lib/data/overview";
import { StatCard } from "@/components/stat-card";
import { SyncStatus } from "@/components/sync-status";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Community Overview</h1>
        <p className="text-sm text-muted mt-1">
          Sim Racing Morocco — live snapshot of members, events, and recent results.
        </p>
      </div>
      <Suspense fallback={<OverviewSkeleton />}>
        <Overview />
      </Suspense>
    </div>
  );
}

async function Overview() {
  // This data changes between requests (member activity, upcoming events
  // relative to "now") and is cheap to compute, so render it at request
  // time rather than caching it. See lib/data/overview.ts.
  await connection();
  const overview = await getOverview();

  return (
    <div className="space-y-8">
      <SyncStatus lastSyncAt={overview.lastSyncAt} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Members" value={overview.memberCount} />
        <StatCard
          label="Active members"
          value={overview.activeMemberCount}
          sub={`last ${overview.activeWindowDays} days`}
        />
        <StatCard label="Upcoming events" value={overview.upcomingEvents.length} />
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
          Upcoming events
        </h2>
        {overview.upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted">Nothing scheduled yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {overview.upcomingEvents.map((event) => (
              <li key={event.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-xs text-muted">
                    {event.sim.name}
                    {event.trackName ? ` — ${event.trackName}` : ""}
                  </div>
                </div>
                <div className="text-sm text-muted">
                  {event.startAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
          Recent results
        </h2>
        {overview.recentResults.length === 0 ? (
          <p className="text-sm text-muted">No results recorded yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {overview.recentResults.map((result) => (
              <li key={result.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{result.member.displayName}</span>
                  <span className="text-muted"> finished P{result.position} in </span>
                  <span>{result.event.title}</span>
                </div>
                {result.fastestLap && (
                  <span className="text-xs text-accent font-medium">Fastest lap</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-3 w-40 bg-surface rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-lg border border-border bg-surface" />
        ))}
      </div>
      <div className="h-40 rounded-lg border border-border bg-surface" />
    </div>
  );
}
