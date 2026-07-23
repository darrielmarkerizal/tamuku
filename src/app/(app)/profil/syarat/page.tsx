import { ScrollText } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";

type Section = {
  title: string;
  body: string;
};

const SECTIONS: Section[] = [
  {
    title: "Tentang Tamuku",
    body: "Tamuku adalah teman untuk mencatat siklus haid dan konsumsi Tablet Tambah Darah (TTD). Aplikasi ini membantumu memantau kesehatan sendiri, bukan menggantikan pemeriksaan dokter, bidan, atau petugas UKS.",
  },
  {
    title: "Siapa yang bisa pakai",
    body: "Tamuku dibuat untuk siswi SMP. Kalau kamu di bawah umur, sebaiknya beri tahu orang tua atau wali bahwa kamu memakai aplikasi ini. Satu akun untuk satu orang, ya.",
  },
  {
    title: "Tanggung jawabmu",
    body: "Jaga username dan password-mu supaya tetap pribadi. Isi catatan sejujur dan seakurat mungkin agar pengingat dan prediksi lebih pas. Kamu bertanggung jawab atas data yang kamu masukkan.",
  },
  {
    title: "Batasan",
    body: "Prediksi siklus dan pengingat di Tamuku hanya perkiraan, bukan diagnosis medis. Kalau kamu merasa ada keluhan kesehatan, tetap konsultasikan ke tenaga kesehatan atau UKS sekolahmu.",
  },
  {
    title: "Perubahan ketentuan",
    body: "Isi ketentuan ini bisa diperbarui sewaktu-waktu supaya tetap relevan. Kalau ada perubahan penting, kami usahakan memberitahumu lewat aplikasi.",
  },
  {
    title: "Kontak",
    body: "Ada pertanyaan soal ketentuan ini? Kirim email ke halo@tamuku.id dan kami bantu jawab.",
  },
];

export default function SyaratPage() {
  return (
    <>
      <SubpageHeader title="SYARAT & KETENTUAN" backHref="/profil/tentang" />

      <main className="px-5 flex flex-col gap-6 pb-8">
        <section className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro p-5">
          <div className="flex items-start gap-3">
            <div className="size-10 shrink-0 bg-surface border-2 border-ink rounded-full flex items-center justify-center shadow-retro-sm">
              <ScrollText className="size-5 text-ink" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-extrabold text-ink mb-1 uppercase">
                Baca dulu, yuk
              </h2>
              <p className="font-sans text-sm text-ink leading-snug">
                Dengan memakai Tamuku, kamu setuju dengan ketentuan di bawah ini.
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
