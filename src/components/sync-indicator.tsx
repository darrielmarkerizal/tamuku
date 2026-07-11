"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudOff, RefreshCcw } from "lucide-react";
import { flushOutbox } from "@/lib/offline/sync-client";
import { getOfflineDb } from "@/lib/offline/db";

// Kecil, tampil kalau ada outbox pending/failed atau kalau navigator offline.
export function SyncIndicator() {
  const [pending, setPending] = useState(0);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    async function refresh() {
      try {
        const db = getOfflineDb();
        const count = await db.outbox.count();
        setPending(count);
      } catch {}
    }
    refresh();
    const handleOnline = () => {
      setOffline(false);
      flushOutbox().finally(refresh);
    };
    const handleOffline = () => setOffline(true);
    setOffline(typeof navigator !== "undefined" && !navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const interval = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!offline && pending === 0) return null;

  return (
    <Link
      href="/profil/sync"
      aria-label="Status sync"
      className="inline-flex items-center gap-1 px-2 py-1 bg-accent-yellow border-2 border-ink rounded-full shadow-retro-sm"
    >
      {offline ? (
        <CloudOff className="size-3 text-ink" strokeWidth={2.75} />
      ) : (
        <RefreshCcw className="size-3 text-ink" strokeWidth={2.75} />
      )}
      {pending > 0 && (
        <span className="font-mono text-[10px] font-bold text-ink">
          {pending}
        </span>
      )}
    </Link>
  );
}
