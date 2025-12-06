-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "source_data";

-- CreateTable
CREATE TABLE "source_data"."teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pandascore_id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acronym" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_data"."players" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pandascore_id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_data"."matches" (
    "id" SERIAL NOT NULL,
    "scheduled_at" TIMESTAMP,
    "pandascore_id" INTEGER NOT NULL,
    "radiantTeamId" INTEGER,
    "direTeamId" INTEGER,
    "radiantPlayerId" INTEGER,
    "direPlayerId" INTEGER,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_pandascore_id_key" ON "source_data"."teams"("pandascore_id");

-- CreateIndex
CREATE UNIQUE INDEX "players_pandascore_id_key" ON "source_data"."players"("pandascore_id");

-- CreateIndex
CREATE INDEX "players_pandascore_id_idx" ON "source_data"."players"("pandascore_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_pandascore_id_key" ON "source_data"."matches"("pandascore_id");

-- CreateIndex
CREATE INDEX "matches_pandascore_id_idx" ON "source_data"."matches"("pandascore_id");

-- AddForeignKey
ALTER TABLE "source_data"."matches" ADD CONSTRAINT "matches_radiantTeamId_fkey" FOREIGN KEY ("radiantTeamId") REFERENCES "source_data"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_data"."matches" ADD CONSTRAINT "matches_direTeamId_fkey" FOREIGN KEY ("direTeamId") REFERENCES "source_data"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_data"."matches" ADD CONSTRAINT "matches_radiantPlayerId_fkey" FOREIGN KEY ("radiantPlayerId") REFERENCES "source_data"."players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_data"."matches" ADD CONSTRAINT "matches_direPlayerId_fkey" FOREIGN KEY ("direPlayerId") REFERENCES "source_data"."players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
