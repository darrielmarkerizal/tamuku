import { FLASHCARDS } from "@/content/flashcards";

/**
 * Pilih k kartu untuk ditampilkan. Prioritas: kartu yang belum di-seen.
 * Kalau semua sudah seen, fallback: random dari semua.
 *
 * Deterministik untuk test — pakai seededShuffle kalau perlu, tapi MVP OK random.
 */
export function pickNextForUser(
  seen: string[],
  k: number = 1
): string[] {
  const seenSet = new Set(seen);
  const unseen = FLASHCARDS.filter((f) => !seenSet.has(f.id));
  const pool = unseen.length > 0 ? unseen : FLASHCARDS;
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(k, shuffled.length)).map((f) => f.id);
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
