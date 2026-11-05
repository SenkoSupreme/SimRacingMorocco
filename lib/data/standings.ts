import { db } from "@/lib/db";

export interface StandingRow {
  memberId: string;
  displayName: string;
  avatarUrl: string | null;
  starts: number;
  wins: number;
  podiums: number;
  top5: number;
  fastestLaps: number;
  points: number;
}

// Aggregated across all completed events. A dedicated per-season Standing
// table would be premature here — this view is cheap enough to compute on
// read at this data volume (see design-doc-portal.md: don't pay for scale
// you don't have evidence for yet).
export async function getStandings(): Promise<StandingRow[]> {
  const results = await db.result.findMany({
    where: { event: { status: "COMPLETED" } },
    include: { member: true },
  });

  const byMember = new Map<string, StandingRow>();

  for (const r of results) {
    const row =
      byMember.get(r.memberId) ??
      ({
        memberId: r.memberId,
        displayName: r.member.displayName,
        avatarUrl: r.member.avatarUrl,
        starts: 0,
        wins: 0,
        podiums: 0,
        top5: 0,
        fastestLaps: 0,
        points: 0,
      } satisfies StandingRow);

    row.starts += 1;
    row.points += r.points;
    if (r.fastestLap) row.fastestLaps += 1;
    if (r.position === 1) row.wins += 1;
    if (r.position <= 3) row.podiums += 1;
    if (r.position <= 5) row.top5 += 1;

    byMember.set(r.memberId, row);
  }

  return Array.from(byMember.values()).sort((a, b) => b.points - a.points);
}
