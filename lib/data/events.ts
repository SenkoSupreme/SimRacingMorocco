import { db } from "@/lib/db";

export async function getUpcomingEvents() {
  return db.event.findMany({
    where: { status: "SCHEDULED", startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
    include: { sim: true, results: true },
  });
}

export async function getPastEvents() {
  return db.event.findMany({
    where: { status: "COMPLETED" },
    orderBy: { startAt: "desc" },
    take: 20,
    include: { sim: true, results: true },
  });
}
