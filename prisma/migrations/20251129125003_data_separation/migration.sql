-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "bot";

-- CreateEnum
CREATE TYPE "bot"."Language" AS ENUM ('English');

-- CreateEnum
CREATE TYPE "bot"."Timezone" AS ENUM ('EET', 'GMT');

-- CreateEnum
CREATE TYPE "bot"."Tier" AS ENUM ('S', 'A', 'B', 'C', 'D', 'Unknown');

-- CreateTable
CREATE TABLE "bot"."channel_configurations" (
    "id" SERIAL NOT NULL,
    "channel_id" BIGINT NOT NULL,
    "tiers" "bot"."Tier"[] DEFAULT ARRAY['S', 'A']::"bot"."Tier"[],
    "timezone" "bot"."Timezone" NOT NULL DEFAULT 'GMT',
    "preferred_language" "bot"."Language" NOT NULL DEFAULT 'English',
    "daily_notification_time" TIME,

    CONSTRAINT "channel_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_configurations_channel_id_key" ON "bot"."channel_configurations"("channel_id");

-- CreateIndex
CREATE INDEX "channel_configurations_channel_id_idx" ON "bot"."channel_configurations"("channel_id");
