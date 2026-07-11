"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { correctStockAction } from "@/lib/ttd/actions";
import { trySubmit } from "@/lib/offline/try-submit";

interface Props {
  currentStock: number;
}

export function KoreksiForm({ currentStock }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(currentStock);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    if (value < 0) {
      setError("Stok nggak bisa negatif.");
      return;
    }
    startTransition(async () => {
      const res = await trySubmit(
        async () => {
          const fd = new FormData();
          fd.set("new_value", String(value));
          fd.set("note", note);
          return correctStockAction(fd);
        },
        "correctStock",
        { new_value: value, note }
      );
      if (res.ok) {
        router.push("/ttd");
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/60">
      <div className="bg-surface w-full rounded-t-3xl border-t-2 border-ink shadow-retro-lg flex flex-col">
        <div className="w-full flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-text-muted rounded-full" />
        </div>

        <div className="px-5 pt-2 pb-8 overflow-y-auto max-h-[85dvh]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink uppercase tracking-tight">
                KOREKSI STOK
              </h2>
              <p className="font-sans text-base text-text-muted mt-1">
                Set nilai stok TTD ke jumlah pil aktual.
              </p>
            </div>
            <Link
              href="/ttd"
              aria-label="Tutup"
              className="size-9 bg-surface border-2 border-ink rounded-[8px] shadow-retro-sm flex items-center justify-center press-retro"
            >
              <X className="size-5 text-ink" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mb-10">
            <button
              type="button"
              aria-label="Kurangi"
              onClick={() => setValue((v) => Math.max(0, v - 1))}
              className="size-14 bg-surface border-2 border-ink shadow-retro rounded-[12px] flex items-center justify-center press-retro"
            >
              <Minus className="size-7 text-ink" strokeWidth={3} />
            </button>
            <div className="font-mono text-[64px] font-extrabold text-ink leading-none text-center min-w-[80px] select-none tracking-tighter">
              {value}
            </div>
            <button
              type="button"
              aria-label="Tambah"
              onClick={() => setValue((v) => v + 1)}
              className="size-14 bg-surface border-2 border-ink shadow-retro rounded-[12px] flex items-center justify-center press-retro"
            >
              <Plus className="size-7 text-ink" strokeWidth={3} />
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="font-sans text-sm text-text-muted">
              Stok saat ini: <span className="font-bold text-ink">{currentStock} pil</span>
            </p>
            <p className="font-sans text-sm text-text-muted">
              Delta: {" "}
              <span
                className={
                  value - currentStock >= 0
                    ? "font-bold text-success"
                    : "font-bold text-danger"
                }
              >
                {value - currentStock > 0 ? "+" : ""}
                {value - currentStock} pil
              </span>
            </p>
          </div>

          <Field className="mb-6">
            <Label htmlFor="catatan">Alasan koreksi (opsional)</Label>
            <Input
              id="catatan"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="mis. hitung ulang, ada yang ilang"
              maxLength={120}
            />
          </Field>

          {error && (
            <div className="bg-pink-cream border-2 border-danger rounded-[8px] px-3 py-2 font-sans text-sm text-danger mb-6">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Link href="/ttd" className="flex-1">
              <Button variant="soft" size="lg" className="w-full" type="button">
                BATAL
              </Button>
            </Link>
            <Button
              size="lg"
              className="flex-1"
              type="button"
              onClick={handleSubmit}
              disabled={pending || value === currentStock}
            >
              {pending ? "MENYIMPAN…" : "KOREKSI"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
