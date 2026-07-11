"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCcw, Trash2, XCircle } from "lucide-react";
import { flushOutbox } from "@/lib/offline/sync-client";
import { getOfflineDb } from "@/lib/offline/db";
import { retryEntry } from "@/lib/offline/outbox";
import type { OutboxEntry } from "@/lib/offline/types";

export function SyncDebugClient() {
  const [entries, setEntries] = useState<OutboxEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState(true);

  async function refresh() {
    try {
      const db = getOfflineDb();
      const list = await db.outbox.toArray();
      setEntries(
        list.sort(
          (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
        )
      );
    } catch {
      setEntries([]);
    }
  }

  useEffect(() => {
    refresh();
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  async function handleFlush() {
    setBusy(true);
    await flushOutbox().catch(() => {});
    await refresh();
    setBusy(false);
  }

  async function handleRetry(localId: number) {
    await retryEntry(localId);
    await flushOutbox().catch(() => {});
    await refresh();
  }

  async function handleDelete(localId: number) {
    try {
      const db = getOfflineDb();
      await db.outbox.delete(localId);
    } catch {}
    await refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`border-2 border-ink rounded-[12px] p-4 shadow-retro flex items-center gap-3 ${
          online ? "bg-accent-mint" : "bg-accent-yellow"
        }`}
      >
        {online ? (
          <CheckCircle2 className="size-6 text-ink" strokeWidth={2.5} />
        ) : (
          <XCircle className="size-6 text-ink" strokeWidth={2.5} />
        )}
        <div className="flex-1">
          <p className="font-display text-base font-extrabold uppercase text-ink">
            {online ? "ONLINE" : "OFFLINE"}
          </p>
          <p className="font-sans text-xs text-ink">
            {online
              ? "Semua mutasi bakal langsung ter-sync."
              : "Mutasi ditahan di antrian sampai online."}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
          ANTRIAN OUTBOX ({entries.length})
        </h2>
        <button
          type="button"
          onClick={handleFlush}
          disabled={busy}
          className="bg-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 border-2 border-ink rounded-[8px] shadow-retro-sm press-retro disabled:opacity-70 inline-flex items-center gap-1"
        >
          <RefreshCcw className="size-3" strokeWidth={3} />
          {busy ? "SYNC…" : "SYNC SEKARANG"}
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="bg-surface border-2 border-ink rounded-[12px] p-6 text-center shadow-retro-sm">
          <p className="font-display text-lg font-extrabold uppercase text-ink mb-1">
            Antrian kosong
          </p>
          <p className="font-sans text-sm text-text-muted">
            Semua mutasi kamu sudah tersimpan di server.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((e) => (
            <li
              key={e.localId}
              className="bg-surface border-2 border-ink rounded-[12px] p-3 shadow-retro-sm flex items-center gap-3"
            >
              <StatusPill status={e.status} />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs font-bold text-ink truncate">
                  {e.op.type}
                </p>
                {e.lastError && (
                  <p className="font-sans text-[10px] text-danger truncate">
                    {e.lastError}
                  </p>
                )}
              </div>
              <span className="font-mono text-[10px] text-text-muted">
                x{e.attempts}
              </span>
              {e.status === "failed" && (
                <button
                  type="button"
                  onClick={() => e.localId && handleRetry(e.localId)}
                  aria-label="Retry"
                  className="size-8 bg-accent-yellow border-2 border-ink rounded-[6px] flex items-center justify-center shadow-retro-sm press-retro"
                >
                  <RefreshCcw className="size-3.5 text-ink" strokeWidth={2.75} />
                </button>
              )}
              <button
                type="button"
                onClick={() => e.localId && handleDelete(e.localId)}
                aria-label="Hapus"
                className="size-8 bg-pink-cream border-2 border-ink rounded-[6px] flex items-center justify-center shadow-retro-sm press-retro"
              >
                <Trash2 className="size-3.5 text-ink" strokeWidth={2.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: OutboxEntry["status"] }) {
  const map = {
    pending: "bg-accent-yellow text-ink",
    syncing: "bg-accent-mint text-ink",
    failed: "bg-danger text-white",
  } as const;
  return (
    <span
      className={`shrink-0 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border-2 border-ink rounded-full ${map[status]}`}
    >
      {status}
    </span>
  );
}
