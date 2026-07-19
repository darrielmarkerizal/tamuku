"use client";

import { useEffect } from "react";
import { flushOutbox, hydrate } from "@/lib/offline/sync-client";

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
