import type { CommunitySnapshot, CommunitySource } from "./types";

// TODO once bot access lands: pull from wherever Person A's bot actually
// stores data (its own DB, a Discord REST/gateway read, or an export file he
// gives you) and map it into the RawMember/RawEvent/RawResult shapes in
// ./types. Nothing outside this file should know those details — sync.ts and
// every page only ever see the normalized shapes.
export const discordBotSource: CommunitySource = {
  name: "discord-bot",

  async fetchSnapshot(): Promise<CommunitySnapshot> {
    throw new Error(
      "discordBotSource not implemented yet — waiting on bot data access. " +
        "Until then, run `npx prisma db seed` for fake data to build against."
    );
  },
};
