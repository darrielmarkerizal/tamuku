"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw, WifiOff } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main
      className="min-h-dvh flex items-center justify-center px-5 py-8 relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#e2bdc5 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <span className="absolute top-10 -left-5 size-16 border-2 border-ink bg-accent-mint rounded-full shadow-retro-sm opacity-60 -z-0" />
      <span className="absolute bottom-20 -right-8 size-24 border-2 border-ink bg-pink-soft rotate-45 shadow-retro-sm opacity-60 -z-0" />

      <div className="flex flex-col items-center justify-center w-full max-w-sm z-10">
        <div className="relative w-full bg-accent-yellow border-2 border-ink rounded-[16px] p-6 flex items-center justify-center mb-8 shadow-retro">
          <div className="absolute -top-5 -right-4 bg-surface border-2 border-ink rounded-full size-12 flex items-center justify-center shadow-retro-sm rotate-12 z-20">
            <WifiOff className="size-6 text-danger" strokeWidth={2.75} />
          </div>
          <div className="w-48 h-48 flex items-center justify-center drop-shadow-[4px_4px_0_#1a0a14] relative z-10">
            <Mascot state="tired" size={170} />
          </div>
        </div>

        <div className="text-center w-full mb-10">
          <h1 className="font-display text-[40px] leading-none font-black text-ink mb-4 uppercase tracking-tight">
            LAGI OFFLINE NIH
          </h1>
          <p className="font-sans text-lg text-text-muted max-w-[320px] mx-auto leading-relaxed">
            Tenang, catatanmu tetap tersimpan dan bakal otomatis dikirim begitu kamu online lagi.
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
          >
            <RefreshCw className="size-5" strokeWidth={2.75} />
            COBA LAGI
          </Button>

          <Link
            href="/dashboard"
            className="font-mono text-[11px] font-bold uppercase tracking-wider text-text-muted hover:text-primary-strong transition-colors underline decoration-2 underline-offset-4 flex items-center gap-1"
          >
            Buka beranda dari cache
            <ArrowRight className="size-3.5" strokeWidth={2.75} />
          </Link>
        </div>
      </div>
    </main>
  );
}
