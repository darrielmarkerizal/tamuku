"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const updateProfileSchema = z.object({
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
});

export async function updateProfileAction(
  formData: FormData
): Promise<ProfileActionResult> {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    school: formData.get("school") ?? "",
    class_name: formData.get("class_name") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Ada isi yang belum benar.", fieldErrors };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      school: parsed.data.school || null,
      class_name: parsed.data.class_name || null,
    },
  });

  revalidatePath("/profil");
  revalidatePath("/dashboard");
  return { ok: true };
}
