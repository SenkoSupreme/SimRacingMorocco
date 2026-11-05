// Contract any data source must satisfy to feed the sync job. Keeping this
// as an explicit interface is what lets the Discord/bot adapter change (or
// get replaced entirely) without touching sync.ts or any page.

export interface RawMember {
  discordId: string;
  displayName: string;
  avatarUrl?: string;
  lastSeenAt?: Date;
}

export interface RawEvent {
  sourceEventId: string;
  simSlug: string;
  simName: string;
  title: string;
  trackName?: string;
  startAt: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface RawResult {
  sourceEventId: string;
  memberDiscordId: string;
  position: number;
  points?: number;
  fastestLap?: boolean;
}

export interface CommunitySnapshot {
  members: RawMember[];
  events: RawEvent[];
  results: RawResult[];
}

export interface CommunitySource {
  name: string;
  fetchSnapshot(): Promise<CommunitySnapshot>;
}
