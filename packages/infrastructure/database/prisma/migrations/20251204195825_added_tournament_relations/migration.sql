/*
  Warnings:

  - Added the required column `tournamentId` to the `tournament_iterations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentIterationId` to the `tournament_phases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "source_data"."tournament_iterations" ADD COLUMN     "tournamentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "source_data"."tournament_phases" ADD COLUMN     "tournamentIterationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "source_data"."tournament_phases" ADD CONSTRAINT "tournament_phases_tournamentIterationId_fkey" FOREIGN KEY ("tournamentIterationId") REFERENCES "source_data"."tournament_iterations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_data"."tournament_iterations" ADD CONSTRAINT "tournament_iterations_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "source_data"."tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
