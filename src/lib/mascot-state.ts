import { addDays } from "@/lib/date";
import type { MascotState } from "@/components/mascot";

export function moodToMascotState(mood: string | null | undefined): MascotState {
  switch (mood) {
    case "HAPPY":
      return "vibrant";
    case "CALM":
      return "cheerful";
    case "ANXIOUS":
    case "TIRED":
      return "tired";
    case "SAD":
    case "ANGRY":
      return "pucat";
    default:
      return "cheerful";
  }
}

export function computeMascotStateFromJournal(
  journals: { log_date: Date; mood: string | null }[],
  reference: Date,
  windowDays = 3
): MascotState {
  const cutoff = addDays(reference, -(windowDays - 1));
  const latest = journals
    .filter((j) => j.mood && j.log_date >= cutoff)
    .sort((a, b) => b.log_date.getTime() - a.log_date.getTime())[0];
  return moodToMascotState(latest?.mood ?? null);
}
