/*
  Warnings:

  - Added the required column `tournamentPhaseId` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "source_data"."matches" ADD COLUMN     "tournamentPhaseId" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "source_data"."tournament_phases" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pandascore_id" INTEGER NOT NULL,
    "tier" "bot"."Tier" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "begin_at" TIMESTAMP,
    "end_at" TIMESTAMP,

    CONSTRAINT "tournament_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_data"."tournament_iterations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pandascore_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "begin_at" TIMESTAMP,
    "end_at" TIMESTAMP,

    CONSTRAINT "tournament_iterations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_data"."tournaments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pandascore_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tournament_phases_pandascore_id_key" ON "source_data"."tournament_phases"("pandascore_id");

-- CreateIndex
CREATE INDEX "tournament_phases_pandascore_id_idx" ON "source_data"."tournament_phases"("pandascore_id");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_iterations_pandascore_id_key" ON "source_data"."tournament_iterations"("pandascore_id");

-- CreateIndex
CREATE INDEX "tournament_iterations_pandascore_id_idx" ON "source_data"."tournament_iterations"("pandascore_id");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_pandascore_id_key" ON "source_data"."tournaments"("pandascore_id");

-- CreateIndex
CREATE INDEX "tournaments_pandascore_id_idx" ON "source_data"."tournaments"("pandascore_id");

-- AddForeignKey
ALTER TABLE "source_data"."matches" ADD CONSTRAINT "matches_tournamentPhaseId_fkey" FOREIGN KEY ("tournamentPhaseId") REFERENCES "source_data"."tournament_phases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
