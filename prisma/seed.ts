import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" }),
});

const MEMBER_NAMES = [
  "Yassine_R",
  "Karim.SRM",
  "Nizar_GT",
  "Sofia_Drift",
  "Mehdi99",
  "Oussama_LMU",
  "Imane_Racing",
  "Anas_Pit",
  "Hamza_AC",
  "Lina_Apex",
];

async function main() {
  console.log("Seeding fake data...");

  const members = await Promise.all(
    MEMBER_NAMES.map((name, i) =>
      db.member.upsert({
        where: { discordId: `seed-${i}` },
        create: {
          discordId: `seed-${i}`,
          displayName: name,
          lastSeenAt: new Date(Date.now() - i * 1000 * 60 * 60 * 6), // stagger activity
        },
        update: {},
      })
    )
  );

  const assettoCorsa = await db.sim.upsert({
    where: { slug: "assetto-corsa" },
    create: { slug: "assetto-corsa", name: "Assetto Corsa" },
    update: {},
  });

  const lemansUltimate = await db.sim.upsert({
    where: { slug: "le-mans-ultimate" },
    create: { slug: "le-mans-ultimate", name: "Le Mans Ultimate" },
    update: {},
  });

  // Two completed events with full result sets.
  const pastEvent1 = await db.event.upsert({
    where: { sourceEventId: "seed-event-past-1" },
    create: {
      sourceEventId: "seed-event-past-1",
      simId: assettoCorsa.id,
      title: "SRM Friday Night Sprint",
      trackName: "Mugello",
      startAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      status: "COMPLETED",
    },
    update: {},
  });

  const pastEvent2 = await db.event.upsert({
    where: { sourceEventId: "seed-event-past-2" },
    create: {
      sourceEventId: "seed-event-past-2",
      simId: lemansUltimate.id,
      title: "SRM Endurance Night",
      trackName: "Le Mans",
      startAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      status: "COMPLETED",
    },
    update: {},
  });

  for (const [event, pointsTable] of [
    [pastEvent1, [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]],
    [pastEvent2, [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]],
  ] as const) {
    for (let i = 0; i < members.length; i++) {
      await db.result.upsert({
        where: { eventId_memberId: { eventId: event.id, memberId: members[i].id } },
        create: {
          eventId: event.id,
          memberId: members[i].id,
          position: i + 1,
          points: pointsTable[i] ?? 0,
          fastestLap: i === 0,
        },
        update: {},
      });
    }
  }

  // Upcoming, scheduled events — no results yet.
  await db.event.upsert({
    where: { sourceEventId: "seed-event-upcoming-1" },
    create: {
      sourceEventId: "seed-event-upcoming-1",
      simId: assettoCorsa.id,
      title: "SRM GT3 Cup — Round 3",
      trackName: "Spa-Francorchamps",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      status: "SCHEDULED",
    },
    update: {},
  });

  await db.event.upsert({
    where: { sourceEventId: "seed-event-upcoming-2" },
    create: {
      sourceEventId: "seed-event-upcoming-2",
      simId: lemansUltimate.id,
      title: "SRM 6 Hours of Portimão",
      trackName: "Portimão",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      status: "SCHEDULED",
    },
    update: {},
  });

  // A successful sync log so the dashboard's "last updated" indicator has
  // something real to show instead of "no sync yet".
  await db.syncLog.create({
    data: {
      source: "seed",
      startedAt: new Date(Date.now() - 1000 * 60 * 20),
      finishedAt: new Date(Date.now() - 1000 * 60 * 19),
      status: "SUCCESS",
      recordsSynced: members.length,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
