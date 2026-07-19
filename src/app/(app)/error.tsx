"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Unplug } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70dvh] flex items-center justify-center px-5 py-8">
      <div className="flex flex-col items-center justify-center w-full max-w-sm">
        <div className="relative w-full bg-accent-peach border-2 border-ink rounded-[16px] p-6 flex items-center justify-center mb-8 shadow-retro">
          <div className="absolute -top-5 -right-4 bg-surface border-2 border-ink rounded-full size-12 flex items-center justify-center shadow-retro-sm rotate-12 z-20">
            <Unplug className="size-6 text-danger" strokeWidth={2.75} />
          </div>
          <Mascot state="tired" size={140} />
        </div>

        <div className="text-center w-full mb-8">
          <h1 className="font-display text-[32px] leading-none font-black text-ink mb-3 uppercase tracking-tight">
            ADA YANG NGADAT
          </h1>
          <p className="font-sans text-base text-text-muted leading-relaxed">
            Bukan salah kamu. Datanya gagal dimuat sebentar — catatan yang sudah
            tersimpan tetap aman.
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-5">
          <Button size="lg" className="w-full" onClick={reset}>
            <RefreshCw className="size-5" strokeWidth={2.75} />
            COBA LAGI
          </Button>

          <Link
            href="/dashboard"
            className="label-micro text-text-muted hover:text-primary-strong transition-colors underline decoration-2 underline-offset-4"
          >
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
