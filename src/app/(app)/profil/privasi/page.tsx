import { ChevronRight, Download, Eye, Lock, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubpageHeader } from "@/components/subpage-header";

type Item = {
  Icon: typeof Lock;
  title: string;
  desc: string;
  href?: string;
  tone?: "default" | "danger";
};

const ITEMS: Item[] = [
  {
    Icon: Eye,
    title: "Siapa yang bisa lihat datamu?",
    desc: "Cuma kamu. Data haid & jurnal ga dibagikan ke siapa pun.",
    href: "#",
  },
  {
    Icon: Lock,
    title: "Enkripsi penyimpanan",
    desc: "Data lokal di HP-mu disimpan terenkripsi.",
    href: "#",
  },
  {
    Icon: Download,
    title: "Ekspor data pribadi",
    desc: "Download semua data kamu dalam format JSON.",
    href: "#",
  },
  {
    Icon: Trash2,
    title: "Hapus semua data",
    desc: "Hapus log haid, TTD, dan jurnal — akun tetap aktif.",
    href: "#",
    tone: "danger",
  },
  {
    Icon: UserX,
    title: "Hapus akun selamanya",
    desc: "Tindakan ini tidak bisa dibatalkan.",
    href: "#",
    tone: "danger",
  },
];

export default function PrivasiPage() {
  return (
    <>
      <SubpageHeader title="PRIVASI & DATA" backHref="/profil" />

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
                Data haid, TTD, dan jurnal kamu disimpan pribadi. Tidak ada
                sekolah, UKS, atau pihak ketiga yang bisa lihat tanpa izinmu.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          {ITEMS.map((it) => (
            <a
              key={it.title}
              href={it.href}
              className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3 press-retro"
            >
              <div
                className={
                  it.tone === "danger"
                    ? "size-10 shrink-0 bg-pink-cream border-2 border-ink rounded-[8px] flex items-center justify-center"
                    : "size-10 shrink-0 bg-pink-soft border-2 border-ink rounded-[8px] flex items-center justify-center"
                }
              >
                <it.Icon
                  className={
                    it.tone === "danger"
                      ? "size-5 text-danger"
                      : "size-5 text-primary-strong"
                  }
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={
                    it.tone === "danger"
                      ? "font-display text-base font-extrabold text-danger leading-tight"
                      : "font-display text-base font-extrabold text-ink leading-tight"
                  }
                >
                  {it.title}
                </h3>
                <p className="font-sans text-sm text-text-muted leading-snug mt-0.5">
                  {it.desc}
                </p>
              </div>
              <ChevronRight
                className="size-5 text-text-muted shrink-0"
                strokeWidth={2.5}
              />
            </a>
          ))}
        </section>

        <Button variant="ghost" size="lg" className="w-full mt-2">
          BACA KEBIJAKAN PRIVASI LENGKAP
        </Button>
      </main>
    </>
  );
}
