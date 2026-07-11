import { redirect } from "next/navigation";
import { today, toIsoDate } from "@/lib/date";

export default async function JurnalTodayPage() {
  redirect(`/jurnal/${toIsoDate(today())}`);
}
