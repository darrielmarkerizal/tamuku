import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("DIRECT_URL or DATABASE_URL required");

const db = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  }),
});

async function main() {
  const password = await bcrypt.hash("rahasia123", 12);
  const now = new Date();
  const day = (offset: number) => {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    d.setUTCDate(d.getUTCDate() + offset);
    return d;
  };

  // User demo
  const user = await db.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      password,
      name: "Nisa Demo",
      email: "demo@tamuku.id",
      school: "SMP Demo Sepaku",
      class_name: "8A",
      inventory_ttd: 10,
      guardian_aware: true,
      consent_accepted_at: now,
      last_login_at: now,
      onboarding_completed: true,
    },
  });

  // Notification setting default
  await db.notificationSetting.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      weekly_day: 5, // Jumat
      reminder_hour: 19,
      reminder_minute: 0,
      enabled: true,
    },
  });

  // 3 siklus haid tercatat (biar SMA jalan)
  await db.menstruationLog.createMany({
    data: [
      { userId: user.id, start_date: day(-90), end_date: day(-84), cycle_length: null, period_length: 7, source: "MANUAL" },
      { userId: user.id, start_date: day(-62), end_date: day(-56), cycle_length: 28, period_length: 7, source: "MANUAL" },
      { userId: user.id, start_date: day(-34), end_date: day(-28), cycle_length: 28, period_length: 7, source: "MANUAL" },
    ],
    skipDuplicates: true,
  });

  // Beberapa log TTD 3 minggu terakhir (weekly Jumat)
  for (let i = 3; i >= 1; i--) {
    const d = day(-i * 7 + (5 - now.getUTCDay() + 7) % 7);
    await db.ttdLog.upsert({
      where: {
        userId_log_date: { userId: user.id, log_date: d },
      },
      update: {},
      create: {
        userId: user.id,
        log_date: d,
        status: "WEEKLY_ROUTINE",
      },
    });
  }

  // Jurnal 3 hari terakhir
  for (let i = 1; i <= 3; i++) {
    const d = day(-i);
    await db.journalLog.upsert({
      where: { userId_log_date: { userId: user.id, log_date: d } },
      update: {},
      create: {
        userId: user.id,
        log_date: d,
        mood: i === 1 ? "HAPPY" : i === 2 ? "CALM" : "TIRED",
        symptoms: i === 3 ? ["FATIGUE"] : [],
        notes: `Hari ke-${i} jurnal demo.`,
      },
    });
  }

  console.log("Seed done. Login: demo / rahasia123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
