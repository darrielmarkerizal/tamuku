"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const QUICK = [
  { value: 4, label: "+4", hint: "(1 STRIP)", tone: "bg-accent-yellow" },
  { value: 10, label: "+10", hint: "", tone: "bg-pink-soft" },
  { value: 30, label: "+30", hint: "(1 BOTOL)", tone: "bg-accent-mint" },
];

export default function TambahStokTtdPage() {
  const [pills, setPills] = useState(4);

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
                TAMBAH STOK TTD
              </h2>
              <p className="font-sans text-base text-text-muted mt-1">
                Berapa pil yang baru kamu dapat?
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
              onClick={() => setPills((p) => Math.max(0, p - 1))}
              className="size-14 bg-surface border-2 border-ink shadow-retro rounded-[12px] flex items-center justify-center press-retro"
            >
              <Minus className="size-7 text-ink" strokeWidth={3} />
            </button>
            <div className="font-mono text-[64px] font-extrabold text-ink leading-none text-center min-w-[80px] select-none tracking-tighter">
              {pills}
            </div>
            <button
              type="button"
              aria-label="Tambah"
              onClick={() => setPills((p) => p + 1)}
              className="size-14 bg-surface border-2 border-ink shadow-retro rounded-[12px] flex items-center justify-center press-retro"
            >
              <Plus className="size-7 text-ink" strokeWidth={3} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-8">
            {QUICK.map((q) => (
              <button
                key={q.value}
                type="button"
                onClick={() => setPills(q.value)}
                className={cn(
                  "w-full border-2 border-ink shadow-retro py-4 rounded-[12px] font-mono text-[11px] font-bold text-ink uppercase tracking-wider press-retro flex justify-center items-center gap-2",
                  q.tone
                )}
              >
                {q.label} {q.hint && <span className="opacity-70">{q.hint}</span>}
              </button>
            ))}
          </div>

          <Field className="mb-8">
            <Label htmlFor="catatan">Catatan (opsional)</Label>
            <Input id="catatan" placeholder="Dari kakak UKS, dari apotek, dll." />
          </Field>

          <div className="flex gap-3">
            <Link href="/ttd" className="flex-1">
              <Button variant="soft" size="lg" className="w-full">
                BATAL
              </Button>
            </Link>
            <Button size="lg" className="flex-1">
              SIMPAN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
