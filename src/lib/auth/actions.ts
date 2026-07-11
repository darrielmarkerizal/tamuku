"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { parseIsoDate } from "@/lib/date";
import { hashPassword, verifyPassword } from "./password";
import { SESSION_CONFIG, signSession, verifySession } from "./session";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

// ─── Schemas ─────────────────────────────────────────────────────────────────

const usernameSchema = z
  .string()
  .trim()
  .min(4, "Username minimal 4 karakter")
  .max(24, "Username maksimal 24 karakter")
  .regex(/^[a-z0-9_]+$/i, "Hanya huruf, angka, dan underscore")
  .transform((v) => v.toLowerCase());

const passwordSchema = z
  .string()
  .min(6, "Password minimal 6 karakter")
  .max(72, "Password terlalu panjang");

const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(120)
    .optional()
    .or(z.literal("")),
  school: z.string().trim().max(80).optional().or(z.literal("")),
  class_name: z.string().trim().max(20).optional().or(z.literal("")),
  guardian_aware: z
    .union([z.literal("on"), z.literal("true"), z.literal("false"), z.literal("")])
    .optional(),
});

const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "Password wajib diisi"),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function setSessionCookie(userId: string, username: string) {
  const token = await signSession({ userId, username });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_CONFIG.name, token, {
    httpOnly: SESSION_CONFIG.httpOnly,
    sameSite: SESSION_CONFIG.sameSite,
    path: SESSION_CONFIG.path,
    secure: SESSION_CONFIG.secure,
    maxAge: SESSION_CONFIG.maxAge,
  });
}

function collectFieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// ─── Server Actions ──────────────────────────────────────────────────────────

export async function registerAction(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    username: formData.get("username") ?? "",
    password: formData.get("password") ?? "",
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    school: formData.get("school") ?? "",
    class_name: formData.get("class_name") ?? "",
    guardian_aware: formData.get("guardian_aware") ?? "",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: collectFieldErrors(parsed.error) };
  }

  const {
    username,
    password,
    name,
    email,
    school,
    class_name,
    guardian_aware,
  } = parsed.data;

  if (guardian_aware !== "on" && guardian_aware !== "true") {
    return {
      fieldErrors: {
        guardian_aware: "Harap centang pemberitahuan ke orang tua/wali",
      },
    };
  }

  const existing = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (existing) {
    return { fieldErrors: { username: "Username sudah dipakai" } };
  }

  const password_hash = await hashPassword(password);
  const user = await db.user.create({
    data: {
      username,
      password: password_hash,
      name,
      email: email || null,
      school: school || null,
      class_name: class_name || null,
      guardian_aware: true,
      consent_accepted_at: new Date(),
      last_login_at: new Date(),
    },
    select: { id: true, username: true },
  });

  await setSessionCookie(user.id, user.username);
  redirect("/onboarding");
}

export async function loginAction(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    username: formData.get("username") ?? "",
    password: formData.get("password") ?? "",
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: collectFieldErrors(parsed.error) };
  }

  const user = await db.user.findFirst({
    where: { username: parsed.data.username, deletedAt: null },
    select: {
      id: true,
      username: true,
      password: true,
      onboarding_completed: true,
    },
  });

  if (!user) {
    return { error: "Username atau password salah" };
  }

  const ok = await verifyPassword(parsed.data.password, user.password);
  if (!ok) {
    return { error: "Username atau password salah" };
  }

  await db.user.update({
    where: { id: user.id },
    data: { last_login_at: new Date() },
  });

  await setSessionCookie(user.id, user.username);
  redirect(user.onboarding_completed ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.name);
  redirect("/login");
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

const completeOnboardingSchema = z.object({
  weekly_day: z.coerce.number().int().min(0).max(6),
  reminder_hour: z.coerce.number().int().min(0).max(23),
  reminder_minute: z.coerce.number().int().min(0).max(59),
  enabled: z
    .union([z.literal("on"), z.literal("true"), z.literal("false"), z.literal("")])
    .optional(),
  period_start_iso: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  initial_ttd: z.coerce.number().int().min(0).max(500).optional(),
});

export async function completeOnboardingAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.name)?.value;
  const session = await verifySession(token);
  if (!session) redirect("/login");

  const parsed = completeOnboardingSchema.safeParse({
    weekly_day: formData.get("weekly_day"),
    reminder_hour: formData.get("reminder_hour"),
    reminder_minute: formData.get("reminder_minute"),
    enabled: formData.get("enabled") ?? "",
    period_start_iso: formData.get("period_start_iso") ?? "",
    initial_ttd: formData.get("initial_ttd") ?? undefined,
  });

  const data = parsed.success
    ? parsed.data
    : {
        weekly_day: 5,
        reminder_hour: 19,
        reminder_minute: 0,
        enabled: "on" as const,
        period_start_iso: "",
        initial_ttd: undefined,
      };

  const enabled = data.enabled === "on" || data.enabled === "true";
  const initialTtd = data.initial_ttd ?? 0;
  const periodStart = data.period_start_iso
    ? parseIsoDate(data.period_start_iso)
    : null;

  await db.$transaction(async (tx) => {
    await tx.notificationSetting.upsert({
      where: { userId: session.userId },
      update: {
        weekly_day: data.weekly_day,
        reminder_hour: data.reminder_hour,
        reminder_minute: data.reminder_minute,
        enabled,
      },
      create: {
        userId: session.userId,
        weekly_day: data.weekly_day,
        reminder_hour: data.reminder_hour,
        reminder_minute: data.reminder_minute,
        enabled,
      },
    });

    if (periodStart) {
      await tx.menstruationLog.create({
        data: {
          userId: session.userId,
          start_date: periodStart,
          source: "MANUAL",
        },
      });
    }

    if (initialTtd > 0) {
      await tx.user.update({
        where: { id: session.userId },
        data: {
          onboarding_completed: true,
          inventory_ttd: initialTtd,
        },
      });
      await tx.inventoryAdjustment.create({
        data: {
          userId: session.userId,
          delta: initialTtd,
          reason: "RECEIVED",
          note: "Stok awal saat onboarding",
        },
      });
    } else {
      await tx.user.update({
        where: { id: session.userId },
        data: { onboarding_completed: true },
      });
    }
  });

  redirect("/dashboard");
}
