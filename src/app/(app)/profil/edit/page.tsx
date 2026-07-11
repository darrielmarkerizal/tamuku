import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { EditProfileForm } from "./edit-profile-form";

export default async function EditProfilPage() {
  const user = await requireUser();
  const full = await db.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      username: true,
      school: true,
      class_name: true,
    },
  });

  return (
    <EditProfileForm
      initial={{
        name: full?.name ?? "",
        email: full?.email ?? "",
        username: full?.username ?? "",
        school: full?.school ?? "",
        class_name: full?.class_name ?? "",
      }}
    />
  );
}
