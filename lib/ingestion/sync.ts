import { db } from "@/lib/db";
import type { CommunitySource } from "./types";
import { discordBotSource } from "./discordBotSource";

// Orchestrates one ingestion run: fetch -> upsert -> log. A failure here
// should never take the site down — the dashboard just shows a stale
// "last updated" timestamp (see lib/data/overview.ts) until the next run
// succeeds.
export async function runSync(source: CommunitySource = discordBotSource) {
  const log = await db.syncLog.create({
    data: { source: source.name },
  });

  try {
    const snapshot = await source.fetchSnapshot();

    for (const m of snapshot.members) {
      await db.member.upsert({
        where: { discordId: m.discordId },
        create: {
          discordId: m.discordId,
          displayName: m.displayName,
          avatarUrl: m.avatarUrl,
          lastSeenAt: m.lastSeenAt,
        },
        update: {
          displayName: m.displayName,
          avatarUrl: m.avatarUrl,
          lastSeenAt: m.lastSeenAt,
        },
      });
    }

    for (const e of snapshot.events) {
      const sim = await db.sim.upsert({
        where: { slug: e.simSlug },
        create: { slug: e.simSlug, name: e.simName },
        update: { name: e.simName },
      });

      await db.event.upsert({
        where: { sourceEventId: e.sourceEventId },
        create: {
          sourceEventId: e.sourceEventId,
          simId: sim.id,
          title: e.title,
          trackName: e.trackName,
          startAt: e.startAt,
          status: e.status,
        },
        update: {
          title: e.title,
          trackName: e.trackName,
          startAt: e.startAt,
          status: e.status,
        },
      });
    }

    for (const r of snapshot.results) {
      const [event, member] = await Promise.all([
        db.event.findUnique({ where: { sourceEventId: r.sourceEventId } }),
        db.member.findUnique({ where: { discordId: r.memberDiscordId } }),
      ]);
      if (!event || !member) continue; // out-of-order data from the source; skip rather than crash the run

      await db.result.upsert({
        where: { eventId_memberId: { eventId: event.id, memberId: member.id } },
        create: {
          eventId: event.id,
          memberId: member.id,
          position: r.position,
          points: r.points ?? 0,
          fastestLap: r.fastestLap ?? false,
        },
        update: {
          position: r.position,
          points: r.points ?? 0,
          fastestLap: r.fastestLap ?? false,
        },
      });
    }

    await db.syncLog.update({
      where: { id: log.id },
      data: {
        status: "SUCCESS",
        finishedAt: new Date(),
        recordsSynced:
          snapshot.members.length + snapshot.events.length + snapshot.results.length,
      },
    });
  } catch (err) {
    await db.syncLog.update({
      where: { id: log.id },
      data: {
        status: "ERROR",
        finishedAt: new Date(),
        errorMessage: err instanceof Error ? err.message : String(err),
      },
    });
    throw err;
  }
}
