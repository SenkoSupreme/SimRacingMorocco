import { Suspense } from "react";
import { connection } from "next/server";
import { getUpcomingEvents, getPastEvents } from "@/lib/data/events";
import { Reveal } from "@/components/reveal";
import { PageBanner } from "@/components/page-banner";
import { CalendarIcon, FlagIcon } from "@/components/icons";
import e30Convoy from "@/public/images/e30-convoy.webp";

export default function EventsPage() {
  return (
    <div>
      <PageBanner
        image={e30Convoy}
        title="Events"
        subtitle="Upcoming and past community races."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Suspense fallback={<EventsSkeleton />}>
          <Events />
        </Suspense>
      </div>
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
      <EventList
        title="Upcoming"
        events={upcoming}
        emptyText="Nothing scheduled yet."
        icon={<CalendarIcon className="text-accent shrink-0" />}
      />
      <EventList
        title="Past"
        events={past}
        emptyText="No past events recorded yet."
        icon={<FlagIcon className="text-muted shrink-0" />}
      />
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
  icon,
}: {
  title: string;
  events: EventRow[];
  emptyText: string;
  icon: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
        {title}
      </h2>
      {events.length === 0 ? (
        <p className="text-sm text-muted">{emptyText}</p>
      ) : (
        <Reveal>
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {events.map((event) => (
              <li
                key={event.id}
                className="px-4 py-3 flex items-center justify-between gap-4 transition-colors hover:bg-surface-raised"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {icon}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs text-muted truncate">
                      {event.sim.name}
                      {event.trackName ? ` — ${event.trackName}` : ""}
                      {event.results.length > 0 ? ` — ${event.results.length} entrants` : ""}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted tabular-nums shrink-0">
                  {event.startAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
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
