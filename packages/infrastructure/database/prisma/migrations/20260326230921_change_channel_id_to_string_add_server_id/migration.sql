-- AlterTable
ALTER TABLE "bot"."channel_configurations" ADD COLUMN     "server_id" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "channel_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "channel_configurations_server_id_idx" ON "bot"."channel_configurations"("server_id");
