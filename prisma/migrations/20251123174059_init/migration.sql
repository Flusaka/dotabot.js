-- CreateEnum
CREATE TYPE "Language" AS ENUM ('English');

-- CreateEnum
CREATE TYPE "Timezone" AS ENUM ('EET', 'GMT');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('S', 'A', 'B', 'C', 'D', 'Unknown');

-- CreateTable
CREATE TABLE "channel_configurations" (
    "id" SERIAL NOT NULL,
    "channel_id" BIGINT NOT NULL,
    "tiers" "Tier"[] DEFAULT ARRAY['S', 'A']::"Tier"[],
    "timezone" "Timezone" NOT NULL DEFAULT 'GMT',
    "preferred_language" "Language" NOT NULL DEFAULT 'English',
    "daily_notification_time" TIMESTAMP(3),

    CONSTRAINT "channel_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_configurations_channel_id_key" ON "channel_configurations"("channel_id");

-- CreateIndex
CREATE INDEX "channel_configurations_channel_id_idx" ON "channel_configurations"("channel_id");
