import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EdukasiDetailClient } from "@/components/edukasi-detail-client";
import { getCategory } from "@/content/flashcards";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EdukasiKategoriPage({ params }: Props) {
  const user = await requireUser();
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const cur = await db.user.findUnique({
    where: { id: user.id },
    select: { seen_flashcards: true },
  });
  const seenIds = cur?.seen_flashcards ?? [];

  return (
    <>
      <header className="px-5 pt-6 pb-4 flex items-center gap-3 sticky top-0 z-30 bg-bg">
        <Link
          href="/edukasi"
          aria-label="Kembali"
          className="size-10 -ml-2 rounded-full hover:bg-pink-cream flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="size-6 text-ink" strokeWidth={2.5} />
        </Link>
        <div className="flex flex-col min-w-0">
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink truncate">
            {category.label}
          </h1>
          <p className="font-sans text-sm text-text-muted truncate">
            {category.description}
          </p>
        </div>
      </header>

      <main className="px-5 flex flex-col gap-3 mt-2">
        <div className="flex justify-between items-center pb-1">
          <span className="label-micro text-text-muted">
            {category.cards.length} KARTU
          </span>
          <span className="label-micro text-primary-strong">
            TAP UNTUK BUKA
          </span>
        </div>

        <EdukasiDetailClient cards={category.cards} seenIds={seenIds} />
      </main>
    </>
  );
}
