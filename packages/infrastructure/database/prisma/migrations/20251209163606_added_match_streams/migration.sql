-- AlterTable
ALTER TABLE "source_data"."matches" ADD COLUMN     "streams" JSONB[];

-- CreateIndex
CREATE INDEX "teams_pandascore_id_idx" ON "source_data"."teams"("pandascore_id");
