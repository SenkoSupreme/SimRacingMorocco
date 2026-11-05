-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Sim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "simId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "trackName" TEXT,
    "startAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "sourceEventId" TEXT,
    CONSTRAINT "Event_simId_fkey" FOREIGN KEY ("simId") REFERENCES "Sim" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "fastestLap" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Result_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "status" TEXT,
    "recordsSynced" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_discordId_key" ON "Member"("discordId");

-- CreateIndex
CREATE INDEX "Member_lastSeenAt_idx" ON "Member"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "Sim_name_key" ON "Sim"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sim_slug_key" ON "Sim"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_sourceEventId_key" ON "Event"("sourceEventId");

-- CreateIndex
CREATE INDEX "Event_startAt_idx" ON "Event"("startAt");

-- CreateIndex
CREATE INDEX "Event_simId_idx" ON "Event"("simId");

-- CreateIndex
CREATE INDEX "Result_memberId_idx" ON "Result"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_eventId_memberId_key" ON "Result"("eventId", "memberId");
