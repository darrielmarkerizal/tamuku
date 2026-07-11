import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SyncDebugClient } from "./sync-debug-client";

export default function SyncDebugPage() {
  return (
    <>
      <header className="px-5 pt-6 pb-4 flex items-center gap-3 sticky top-0 z-30 bg-bg">
        <Link
          href="/profil"
          aria-label="Kembali"
          className="size-10 -ml-2 rounded-full hover:bg-pink-cream flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="size-6 text-ink" strokeWidth={2.5} />
        </Link>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
          STATUS SYNC
        </h1>
      </header>

      <main className="px-5 pb-8 flex flex-col gap-4">
        <SyncDebugClient />
      </main>
    </>
  );
}
