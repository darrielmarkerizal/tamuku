/**
 * Konstanta streak freeze.
 *
 * Dipisah dari lib/ttd/actions.ts karena file itu bertanda "use server":
 * di modul server-action, SETIAP export harus berupa async function. Meletakkan
 * konstanta di sana membuat seluruh export modulnya hilang saat build.
 */

/** Jatah streak freeze yang diisi ulang tiap awal bulan. */
export const FREEZE_PER_MONTH = 1;

/** Kunci bulan "YYYY-MM" untuk menandai kapan jatah terakhir diisi ulang. */
export function monthKeyOf(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
