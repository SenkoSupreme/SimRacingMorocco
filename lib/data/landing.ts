import { db } from "@/lib/db";

export async function getLandingStats() {
  const [memberCount, eventsRun, upcomingCount, raceEntries] = await Promise.all([
    db.member.count(),
    db.event.count({ where: { status: "COMPLETED" } }),
    db.event.count({ where: { status: "SCHEDULED", startAt: { gte: new Date() } } }),
    db.result.count(),
  ]);

  return { memberCount, eventsRun, upcomingCount, raceEntries };
}
