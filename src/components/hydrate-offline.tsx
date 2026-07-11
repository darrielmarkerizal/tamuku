"use client";

import { useEffect } from "react";
import { flushOutbox, hydrate } from "@/lib/offline/sync-client";

/**
 * Client-only component yang jalan sekali saat masuk /(app) layout.
 * - Fetch snapshot dari server → tulis ke IndexedDB
 * - Flush outbox pending (mutation yang belum ke-sync saat offline)
 * - Register online listener → auto flush saat online balik
 *
 * Kalau gagal, silent — offline data lama tetap tersedia.
 */
export function HydrateOffline() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;

    if (navigator.onLine) {
      hydrate().catch((err) => {
        console.warn("hydrate failed:", err);
      });
      flushOutbox().catch(() => {});
    }

    function handleOnline() {
      flushOutbox().catch(() => {});
    }
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return null;
}
