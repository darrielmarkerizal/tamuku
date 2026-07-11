import { requireUser } from "@/lib/auth/current-user";
import { KoreksiForm } from "./koreksi-form";

export default async function KoreksiTtdPage() {
  const user = await requireUser();
  return <KoreksiForm currentStock={user.inventory_ttd} />;
}
