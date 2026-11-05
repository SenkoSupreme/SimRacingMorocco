import { Suspense } from "react";
import { getStandings } from "@/lib/data/standings";
import { Reveal } from "@/components/reveal";

export default function StandingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">
          Standings
        </h1>
        <p className="text-sm text-muted mt-1">
          Across all completed events. Ratios matter as much as points.
        </p>
      </div>
      <Suspense fallback={<StandingsSkeleton />}>
        <Standings />
      </Suspense>
    </div>
  );
}

async function Standings() {
  const rows = await getStandings();

  if (rows.length === 0) {
    return <p className="text-sm text-muted">No completed events yet.</p>;
  }

  return (
    <Reveal>
      <div className="relative overflow-hidden overflow-x-auto rounded-lg border border-border bg-surface">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium text-right">Starts</th>
              <th className="px-4 py-3 font-medium text-right">Wins</th>
              <th className="px-4 py-3 font-medium text-right">Podiums</th>
              <th className="px-4 py-3 font-medium text-right">Top 5</th>
              <th className="px-4 py-3 font-medium text-right">FL</th>
              <th className="px-4 py-3 font-medium text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const rank = i + 1;
              const podium = rank <= 3;
              return (
                <tr
                  key={row.memberId}
                  className="border-b border-border last:border-0 transition-colors hover:bg-surface-raised"
                >
                  <td className={`px-4 py-3 tabular-nums ${podium ? "font-display text-lg font-bold text-accent" : "text-muted"}`}>
                    {rank}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.displayName}</td>
                  <td className="px-4 py-3 text-right text-muted tabular-nums">{row.starts}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.wins}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.podiums}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.top5}</td>
                  <td className="px-4 py-3 text-right text-accent tabular-nums">{row.fastestLaps}</td>
                  <td className="px-4 py-3 text-right font-display font-bold tabular-nums">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

function StandingsSkeleton() {
  return <div className="h-80 rounded-lg border border-border bg-surface animate-pulse" />;
}
