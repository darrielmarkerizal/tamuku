-- Streak freeze: 1 jatah per bulan agar satu minggu terlewat tidak menghapus streak.
ALTER TABLE "User" ADD COLUMN "streak_freeze_weeks" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "User" ADD COLUMN "streak_freeze_left" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "User" ADD COLUMN "streak_freeze_month" TEXT;

-- Aksesori maskot yang sedang dipakai (dibuka lewat badge).
ALTER TABLE "User" ADD COLUMN "equipped_accessory" TEXT;

-- Mode diskret: netralkan teks & warna di layar.
ALTER TABLE "User" ADD COLUMN "discreet_mode" BOOLEAN NOT NULL DEFAULT false;
