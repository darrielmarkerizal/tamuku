"use client";

import { useEffect, useState } from "react";
import { Share, Smartphone, X } from "lucide-react";

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as unknown as { standalone: boolean }).standalone === true)
  );
}

const DISMISS_KEY = "tamuku_ios_install_dismissed";

export function IosInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isIos()) return;
    if (isStandalone()) return;
    if (window.sessionStorage.getItem(DISMISS_KEY)) return;

    const t = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  function dismiss() {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-24 z-40 px-5">
      <div className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro-lg p-4 flex items-start gap-3">
        <div className="size-10 shrink-0 bg-surface border-2 border-ink rounded-[8px] flex items-center justify-center">
          <Smartphone className="size-5 text-ink" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base font-extrabold text-ink leading-tight mb-1">
            Install Tamuku ke home screen
          </p>
          <p className="font-sans text-xs text-ink leading-snug">
            Buka menu <Share className="inline size-3.5" strokeWidth={2.5} />{" "}
            <span className="font-bold">Bagikan</span> → pilih{" "}
            <span className="font-bold">Tambah ke Layar Awal</span>. Notif push
            baru aktif setelah install (iOS 16.4+).
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Tutup"
          className="size-7 bg-surface border-2 border-ink rounded-full flex items-center justify-center shrink-0"
        >
          <X className="size-3.5 text-ink" strokeWidth={2.75} />
        </button>
      </div>
    </div>
  );
}
