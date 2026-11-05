import { Suspense } from "react";
import { getStandings } from "@/lib/data/standings";

export default function StandingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Standings</h1>
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
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
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
          {rows.map((row, i) => (
            <tr key={row.memberId} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-muted">{i + 1}</td>
              <td className="px-4 py-3 font-medium">{row.displayName}</td>
              <td className="px-4 py-3 text-right text-muted">{row.starts}</td>
              <td className="px-4 py-3 text-right">{row.wins}</td>
              <td className="px-4 py-3 text-right">{row.podiums}</td>
              <td className="px-4 py-3 text-right">{row.top5}</td>
              <td className="px-4 py-3 text-right text-accent">{row.fastestLaps}</td>
              <td className="px-4 py-3 text-right font-semibold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StandingsSkeleton() {
  return <div className="h-80 rounded-lg border border-border bg-surface animate-pulse" />;
}
