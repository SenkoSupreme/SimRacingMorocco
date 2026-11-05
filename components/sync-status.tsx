function relativeTime(date: Date): string {
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function SyncStatus({ lastSyncAt }: { lastSyncAt: Date | null }) {
  const stale = !lastSyncAt || Date.now() - lastSyncAt.getTime() > 1000 * 60 * 60;

  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          stale ? "bg-muted" : "bg-positive"
        }`}
      />
      {lastSyncAt ? `Data updated ${relativeTime(lastSyncAt)}` : "No sync yet — seeded data"}
    </div>
  );
}
