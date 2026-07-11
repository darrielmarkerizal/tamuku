import {
  Angry,
  Battery,
  CloudRain,
  Frown,
  Leaf,
  Smile,
  type LucideIcon,
} from "lucide-react";

// Kunci enum Prisma Mood: HAPPY | CALM | SAD | ANGRY | TIRED | ANXIOUS
export interface MoodMeta {
  value: "HAPPY" | "CALM" | "SAD" | "ANGRY" | "TIRED" | "ANXIOUS";
  label: string;         // "senang"
  labelUpper: string;    // "Senang"
  slug: string;          // "senang" untuk query param
  Icon: LucideIcon;
  tone: string;          // Tailwind class utk background pill
}

export const MOODS: MoodMeta[] = [
  {
    value: "HAPPY",
    label: "senang",
    labelUpper: "Senang",
    slug: "senang",
    Icon: Smile,
    tone: "bg-accent-mint",
  },
  {
    value: "CALM",
    label: "tenang",
    labelUpper: "Tenang",
    slug: "tenang",
    Icon: Leaf,
    tone: "bg-pink-soft",
  },
  {
    value: "SAD",
    label: "sedih",
    labelUpper: "Sedih",
    slug: "sedih",
    Icon: Frown,
    tone: "bg-pink-cream",
  },
  {
    value: "ANGRY",
    label: "kesal",
    labelUpper: "Kesal",
    slug: "kesal",
    Icon: Angry,
    tone: "bg-accent-peach",
  },
  {
    value: "TIRED",
    label: "lelah",
    labelUpper: "Lelah",
    slug: "lelah",
    Icon: Battery,
    tone: "bg-accent-yellow",
  },
  {
    value: "ANXIOUS",
    label: "cemas",
    labelUpper: "Cemas",
    slug: "cemas",
    Icon: CloudRain,
    tone: "bg-pink-soft",
  },
];

export const MOOD_BY_VALUE: Record<MoodMeta["value"], MoodMeta> =
  MOODS.reduce(
    (acc, m) => {
      acc[m.value] = m;
      return acc;
    },
    {} as Record<MoodMeta["value"], MoodMeta>
  );

export const MOOD_BY_SLUG: Record<string, MoodMeta["value"]> =
  MOODS.reduce(
    (acc, m) => {
      acc[m.slug] = m.value;
      return acc;
    },
    {} as Record<string, MoodMeta["value"]>
  );
