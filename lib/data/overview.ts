import { db } from "@/lib/db";

const ACTIVE_WINDOW_DAYS = 14;

export async function getOverview() {
  const activeSince = new Date(Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [memberCount, activeMemberCount, upcomingEvents, recentResults, lastSync] =
    await Promise.all([
      db.member.count(),
      db.member.count({ where: { lastSeenAt: { gte: activeSince } } }),
      db.event.findMany({
        where: { status: "SCHEDULED", startAt: { gte: new Date() } },
        orderBy: { startAt: "asc" },
        take: 5,
        include: { sim: true },
      }),
      db.result.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { member: true, event: { include: { sim: true } } },
      }),
      db.syncLog.findFirst({
        where: { status: "SUCCESS" },
        orderBy: { finishedAt: "desc" },
      }),
    ]);

  return {
    memberCount,
    activeMemberCount,
    activeWindowDays: ACTIVE_WINDOW_DAYS,
    upcomingEvents,
    recentResults,
    lastSyncAt: lastSync?.finishedAt ?? null,
  };
}
