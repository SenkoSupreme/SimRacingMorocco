import { NextResponse } from "next/server";
import { runSync } from "@/lib/ingestion/sync";

// Hit by Vercel Cron (or manually) to pull fresh data. Not wired into
// vercel.json yet — add a cron entry once discordBotSource is implemented.
export async function POST() {
  try {
    await runSync();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
