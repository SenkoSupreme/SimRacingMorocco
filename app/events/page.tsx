import { Suspense } from "react";
import { connection } from "next/server";
import { getUpcomingEvents, getPastEvents } from "@/lib/data/events";

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-sm text-muted mt-1">Upcoming and past community races.</p>
      </div>
      <Suspense fallback={<EventsSkeleton />}>
        <Events />
      </Suspense>
    </div>
  );
}

async function Events() {
  // "Upcoming" is relative to request time — see the Overview component's
  // comment on why this is request-time rather than cached.
  await connection();
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <div className="space-y-8">
      <EventList title="Upcoming" events={upcoming} emptyText="Nothing scheduled yet." />
      <EventList title="Past" events={past} emptyText="No past events recorded yet." />
    </div>
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

function EventList({
  title,
  events,
  emptyText,
}: {
  title: string;
  events: EventRow[];
  emptyText: string;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
        {title}
      </h2>
      {events.length === 0 ? (
        <p className="text-sm text-muted">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {events.map((event) => (
            <li key={event.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-muted">
                  {event.sim.name}
                  {event.trackName ? ` — ${event.trackName}` : ""}
                  {event.results.length > 0 ? ` — ${event.results.length} entrants` : ""}
                </div>
              </div>
              <div className="text-sm text-muted">
                {event.startAt.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-32 rounded-lg border border-border bg-surface" />
      <div className="h-32 rounded-lg border border-border bg-surface" />
    </div>
  );
}
