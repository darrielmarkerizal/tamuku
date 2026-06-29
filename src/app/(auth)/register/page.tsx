"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-[390px] w-full mx-auto min-h-dvh flex flex-col relative px-5 pt-8 pb-12">
      <header className="flex items-center justify-start mb-8">
        <Link
          href="/login"
          aria-label="Kembali"
          className="size-12 bg-surface border-2 border-ink rounded-[8px] flex items-center justify-center shadow-retro press-retro"
        >
          <ArrowLeft className="size-5 text-ink" strokeWidth={2.5} />
        </Link>
      </header>

      <div className="mb-8">
        <h1 className="font-display text-[40px] leading-none font-black text-ink mb-2 uppercase tracking-tight">
          BIKIN AKUN BARU
        </h1>
        <p className="font-sans text-lg text-text-muted">
          Cukup isi info dasar aja, ga ribet.
        </p>
      </div>

      <main className="bg-surface border-2 border-ink rounded-[12px] p-5 shadow-retro-lg mb-8">
        <form className="flex flex-col gap-5">
          <Field>
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" name="fullName" placeholder="Mis. Nisa Fredlina" required />
          </Field>

          <Field>
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" placeholder="min. 4 huruf/angka" required />
          </Field>

          <Field>
            <Label htmlFor="school">Sekolah (opsional)</Label>
            <Input id="school" name="school" placeholder="SMP 1 Sepaku" />
          </Field>

          <Field>
            <Label htmlFor="class">Kelas (opsional)</Label>
            <Input id="class" name="class" placeholder="8A" />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-ink"
              >
                {showPassword ? (
                  <Eye className="size-5" strokeWidth={2.5} />
                ) : (
                  <EyeOff className="size-5" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </Field>

          <label className="flex items-start gap-3 cursor-pointer mt-3 group select-none">
            <input type="checkbox" required className="peer sr-only" />
            <span className="size-6 shrink-0 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center peer-checked:bg-primary peer-checked:[&>svg]:block mt-0.5">
              <svg className="size-4 text-white hidden" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-sans text-sm text-ink leading-tight">
              Aku sudah memberi tahu orang tua/wali bahwa aku pakai aplikasi ini.
            </span>
          </label>
        </form>
      </main>

      <p className="text-center text-text-muted italic text-sm mb-6 px-4 font-sans">
        Datamu disimpan pribadi dan tidak dibagikan ke siapa pun.
      </p>

      <Button type="submit" size="lg" className="w-full mb-8">
        DAFTAR SEKARANG
      </Button>

      <div className="text-center font-sans text-text-muted mt-auto">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-primary-strong font-bold underline underline-offset-4 decoration-2 decoration-ink"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
