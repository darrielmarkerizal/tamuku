-- CreateEnum
CREATE TYPE "TtdStatus" AS ENUM ('WEEKLY_ROUTINE', 'MENSTRUATION_ROUTINE');

-- CreateEnum
CREATE TYPE "InventoryReason" AS ENUM ('CONSUMED', 'RECEIVED', 'CORRECTION');

-- CreateEnum
CREATE TYPE "MenstruationSource" AS ENUM ('MANUAL', 'AUTO_CLOSE');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('HAPPY', 'CALM', 'SAD', 'ANGRY', 'TIRED', 'ANXIOUS');

-- CreateEnum
CREATE TYPE "Symptom" AS ENUM ('CRAMP', 'HEADACHE', 'BLOATING', 'ACNE', 'FATIGUE', 'BACKPAIN');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "school" TEXT,
    "class_name" TEXT,
    "birth_date" DATE,
    "inventory_ttd" INTEGER NOT NULL DEFAULT 0,
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "streak_current" INTEGER NOT NULL DEFAULT 0,
    "streak_longest" INTEGER NOT NULL DEFAULT 0,
    "streak_last_week_iso" TEXT,
    "seen_flashcards" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "consent_accepted_at" TIMESTAMP(3),
    "guardian_aware" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenstruationLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "cycle_length" INTEGER,
    "period_length" INTEGER,
    "source" "MenstruationSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenstruationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TtdLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "log_date" DATE NOT NULL,
    "status" "TtdStatus" NOT NULL,
    "flashcard_shown_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TtdLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryAdjustment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" "InventoryReason" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "log_date" DATE NOT NULL,
    "mood" "Mood",
    "symptoms" "Symptom"[] DEFAULT ARRAY[]::"Symptom"[],
    "notes" VARCHAR(280),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSetting" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "reminder_hour" INTEGER NOT NULL DEFAULT 19,
    "reminder_minute" INTEGER NOT NULL DEFAULT 0,
    "weekly_day" INTEGER NOT NULL DEFAULT 5,
    "ttd_daily" BOOLEAN NOT NULL DEFAULT true,
    "ttd_weekly" BOOLEAN NOT NULL DEFAULT true,
    "period_start" BOOLEAN NOT NULL DEFAULT true,
    "period_prediction" BOOLEAN NOT NULL DEFAULT true,
    "low_stock" BOOLEAN NOT NULL DEFAULT true,
    "badge_earned" BOOLEAN NOT NULL DEFAULT true,
    "quiet_start_hour" INTEGER NOT NULL DEFAULT 21,
    "quiet_end_hour" INTEGER NOT NULL DEFAULT 6,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyKey" (
    "key" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_last_login_at_idx" ON "User"("last_login_at");

-- CreateIndex
CREATE INDEX "MenstruationLog_userId_start_date_idx" ON "MenstruationLog"("userId", "start_date");

-- CreateIndex
CREATE INDEX "MenstruationLog_userId_end_date_idx" ON "MenstruationLog"("userId", "end_date");

-- CreateIndex
CREATE INDEX "TtdLog_userId_log_date_idx" ON "TtdLog"("userId", "log_date");

-- CreateIndex
CREATE UNIQUE INDEX "TtdLog_userId_log_date_key" ON "TtdLog"("userId", "log_date");

-- CreateIndex
CREATE INDEX "InventoryAdjustment_userId_createdAt_idx" ON "InventoryAdjustment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "JournalLog_userId_log_date_idx" ON "JournalLog"("userId", "log_date");

-- CreateIndex
CREATE UNIQUE INDEX "JournalLog_userId_log_date_key" ON "JournalLog"("userId", "log_date");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSetting_userId_key" ON "NotificationSetting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "IdempotencyKey_userId_idx" ON "IdempotencyKey"("userId");

-- CreateIndex
CREATE INDEX "IdempotencyKey_createdAt_idx" ON "IdempotencyKey"("createdAt");

-- AddForeignKey
ALTER TABLE "MenstruationLog" ADD CONSTRAINT "MenstruationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TtdLog" ADD CONSTRAINT "TtdLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLog" ADD CONSTRAINT "JournalLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSetting" ADD CONSTRAINT "NotificationSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdempotencyKey" ADD CONSTRAINT "IdempotencyKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
