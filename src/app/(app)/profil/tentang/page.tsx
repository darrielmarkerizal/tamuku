import { ExternalLink, Code2, Heart, Mail, ScrollText } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { SubpageHeader } from "@/components/subpage-header";

type LinkItem = {
  Icon: typeof Heart;
  label: string;
  href: string;
};

const LINKS: LinkItem[] = [
  { Icon: ScrollText, label: "Syarat & ketentuan", href: "#" },
  { Icon: ScrollText, label: "Kebijakan privasi", href: "#" },
  { Icon: Mail, label: "Hubungi tim KKN", href: "mailto:halo@tamuku.id" },
  { Icon: Code2, label: "Lihat di GitHub", href: "https://github.com/darrielmarkerizal/tamuku" },
];

type Credit = {
  role: string;
  name: string;
};

const CREDITS: Credit[] = [
  { role: "Lead Developer & Sistem", name: "Darriel Markerizal" },
  { role: "Lead Edukasi & Distribusi", name: "Nisa Fredlina Mahardika Saputri" },
  { role: "Program", name: "KKN Sepaku, Penajam Paser Utara" },
];

export default function TentangPage() {
  return (
    <>
      <SubpageHeader title="TENTANG TAMUKU" backHref="/profil" />

      <main className="px-5 flex flex-col gap-6 pb-8">
        <section className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro-lg p-6 flex flex-col items-center text-center">
          <div className="size-24 mb-4 flex items-center justify-center">
            <Mascot state="vibrant" size={96} />
          </div>
          <h2 className="font-display text-[40px] leading-none font-black text-ink uppercase tracking-tight mb-2">
            TAMUKU
          </h2>
          <p className="font-sans text-base text-ink mb-4 max-w-xs">
            Teman haid & TTD untuk siswi SMP. Hangat, ramah, offline-first.
          </p>
          <div className="inline-flex bg-surface border-2 border-ink rounded-full px-3 py-1 shadow-retro-sm">
            <span className="label-micro text-ink">
              VERSI 1.0.0 • MOCK
            </span>
          </div>
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-5">
          <h3 className="label-micro text-text-muted border-b-2 border-pink-cream pb-2 mb-4">
            TIM PEMBUAT
          </h3>
          <ul className="flex flex-col gap-4">
            {CREDITS.map((c) => (
              <li key={c.role} className="flex flex-col">
                <span className="label-micro text-text-muted">
                  {c.role}
                </span>
                <span className="font-display text-base font-extrabold text-ink">
                  {c.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3 press-retro"
            >
              <div className="size-10 shrink-0 bg-pink-soft border-2 border-ink rounded-[8px] flex items-center justify-center">
                <l.Icon className="size-5 text-primary-strong" strokeWidth={2.5} />
              </div>
              <span className="flex-1 font-sans text-base font-bold text-ink">
                {l.label}
              </span>
              <ExternalLink className="size-4 text-text-muted shrink-0" strokeWidth={2.5} />
            </a>
          ))}
        </section>

        <p className="text-center font-sans text-sm text-text-muted py-4 inline-flex items-center justify-center gap-1.5">
          Dibuat dengan <Heart className="size-4 text-primary" strokeWidth={2.75} fill="currentColor" /> buat Sepaku
        </p>
      </main>
    </>
  );
}
