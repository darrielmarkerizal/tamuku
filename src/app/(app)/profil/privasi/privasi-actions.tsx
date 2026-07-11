"use client";

import { useState, useTransition } from "react";
import {
  ChevronRight,
  Download,
  Trash2,
  UserX,
} from "lucide-react";
import {
  deleteAccountAction,
  deleteAllDataAction,
  exportUserDataAction,
} from "@/lib/profile/privacy-actions";

export function PrivasiActions() {
  const [busy, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        const json = await exportUserDataAction();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tamuku-export-${new Date()
          .toISOString()
          .slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setMessage("Data kamu sudah di-download.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal ekspor.");
      }
    });
  }

  function handleDeleteData() {
    if (
      !confirm(
        "Hapus semua log haid, TTD, dan jurnal? Akun kamu tetap aktif."
      )
    )
      return;
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await deleteAllDataAction();
      if (res.ok) setMessage("Semua data domain sudah dihapus.");
      else setError(res.error);
    });
  }

  function handleDeleteAccount() {
    if (
      !confirm(
        "Hapus akun selamanya? Semua data hilang & tidak bisa dibatalkan."
      )
    )
      return;
    if (
      !confirm(
        "Ini konfirmasi terakhir. Yakin banget ingin menghapus akun?"
      )
    )
      return;
    startTransition(() => deleteAccountAction());
  }

  return (
    <>
      <section className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={busy}
          className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3 press-retro disabled:opacity-70 text-left"
        >
          <div className="size-10 shrink-0 bg-pink-soft border-2 border-ink rounded-[8px] flex items-center justify-center">
            <Download
              className="size-5 text-primary-strong"
              strokeWidth={2.5}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-extrabold text-ink leading-tight">
              Ekspor data pribadi
            </h3>
            <p className="font-sans text-sm text-text-muted leading-snug mt-0.5">
              Download semua data kamu dalam format JSON.
            </p>
          </div>
          <ChevronRight
            className="size-5 text-text-muted shrink-0"
            strokeWidth={2.5}
          />
        </button>

        <button
          type="button"
          onClick={handleDeleteData}
          disabled={busy}
          className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3 press-retro disabled:opacity-70 text-left"
        >
          <div className="size-10 shrink-0 bg-pink-cream border-2 border-ink rounded-[8px] flex items-center justify-center">
            <Trash2 className="size-5 text-danger" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-extrabold text-danger leading-tight">
              Hapus semua data
            </h3>
            <p className="font-sans text-sm text-text-muted leading-snug mt-0.5">
              Hapus log haid, TTD, dan jurnal — akun tetap aktif.
            </p>
          </div>
          <ChevronRight
            className="size-5 text-text-muted shrink-0"
            strokeWidth={2.5}
          />
        </button>

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={busy}
          className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3 press-retro disabled:opacity-70 text-left"
        >
          <div className="size-10 shrink-0 bg-pink-cream border-2 border-ink rounded-[8px] flex items-center justify-center">
            <UserX className="size-5 text-danger" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-extrabold text-danger leading-tight">
              Hapus akun selamanya
            </h3>
            <p className="font-sans text-sm text-text-muted leading-snug mt-0.5">
              Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
          <ChevronRight
            className="size-5 text-text-muted shrink-0"
            strokeWidth={2.5}
          />
        </button>
      </section>

      {message && (
        <div className="bg-accent-mint border-2 border-ink rounded-[8px] px-3 py-2 font-sans text-sm text-ink">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-pink-cream border-2 border-danger rounded-[8px] px-3 py-2 font-sans text-sm text-danger">
          {error}
        </div>
      )}
    </>
  );
}
