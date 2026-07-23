import { Lock } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";

type Section = {
  title: string;
  body: string;
};

const SECTIONS: Section[] = [
  {
    title: "Data yang kami simpan",
    body: "Tamuku menyimpan catatan haid, konsumsi Tablet Tambah Darah, jurnal harian, dan data profilmu seperti nama, sekolah, dan kelas. Semua kamu isi sendiri.",
  },
  {
    title: "Untuk apa datamu dipakai",
    body: "Data dipakai untuk menampilkan kalender siklus, mengirim pengingat, memperkirakan haid berikutnya, dan menghitung statistik pribadimu. Tidak untuk iklan, tidak dijual ke siapa pun.",
  },
  {
    title: "Siapa yang bisa lihat",
    body: "Hanya kamu. Sekolah, UKS, guru, maupun pihak ketiga tidak bisa melihat data haid, TTD, atau jurnalmu tanpa izinmu. Aktifkan mode diskret kalau ingin tampilan lebih samar di tempat umum.",
  },
  {
    title: "Penyimpanan & offline-first",
    body: "Catatanmu tetap tersimpan di perangkat walau sedang tanpa internet, lalu otomatis dikirim ke server yang aman begitu kamu online lagi. Jadi datamu tidak hilang.",
  },
  {
    title: "Hak kamu atas data",
    body: "Kamu bisa mengubah atau menghapus datamu kapan saja lewat menu Profil. Kalau ingin menghapus akun beserta seluruh catatannya, hubungi kami dan kami bantu.",
  },
  {
    title: "Kontak",
    body: "Ada pertanyaan soal privasi? Kirim email ke halo@tamuku.id, kami siap bantu.",
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <>
      <SubpageHeader title="KEBIJAKAN PRIVASI" backHref="/profil/tentang" />

      <main className="px-5 flex flex-col gap-6 pb-8">
        <section className="bg-accent-mint border-2 border-ink rounded-[12px] shadow-retro p-5">
          <div className="flex items-start gap-3">
            <div className="size-10 shrink-0 bg-surface border-2 border-ink rounded-full flex items-center justify-center shadow-retro-sm">
              <Lock className="size-5 text-ink" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-extrabold text-ink mb-1 uppercase">
                Privasimu prioritas utama
              </h2>
              <p className="font-sans text-sm text-ink leading-snug">
                Kami hanya menyimpan yang perlu, dan datamu tetap milikmu.
                Ditulis sederhana biar gampang dimengerti.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          {SECTIONS.map((s, i) => (
            <div
              key={s.title}
              className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="size-7 shrink-0 bg-pink-soft border-2 border-ink rounded-full flex items-center justify-center font-display text-sm font-black text-primary-strong">
                  {i + 1}
                </span>
                <h3 className="font-display text-base font-extrabold text-ink uppercase tracking-tight">
                  {s.title}
                </h3>
              </div>
              <p className="font-sans text-sm text-ink leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </section>

        <p className="text-center label-micro text-text-muted py-2">
          Berlaku sejak 23 Juli 2026
        </p>
      </main>
    </>
  );
}
