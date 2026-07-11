"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { registerAction, type AuthState } from "@/lib/auth/actions";

const INITIAL: AuthState = {};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(registerAction, INITIAL);

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
        <form id="register-form" action={formAction} className="flex flex-col gap-5">
          <Field>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              placeholder="Mis. Nisa Fredlina"
              required
              aria-invalid={!!state?.fieldErrors?.name}
            />
            {state?.fieldErrors?.name && (
              <p className="font-sans text-xs text-danger px-1">
                {state.fieldErrors.name}
              </p>
            )}
          </Field>

          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="min. 4 huruf/angka"
              required
              autoComplete="username"
              aria-invalid={!!state?.fieldErrors?.username}
            />
            {state?.fieldErrors?.username && (
              <p className="font-sans text-xs text-danger px-1">
                {state.fieldErrors.username}
              </p>
            )}
          </Field>

          <Field>
            <Label htmlFor="email">Email (opsional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              aria-invalid={!!state?.fieldErrors?.email}
            />
            {state?.fieldErrors?.email && (
              <p className="font-sans text-xs text-danger px-1">
                {state.fieldErrors.email}
              </p>
            )}
          </Field>

          <Field>
            <Label htmlFor="school">Sekolah (opsional)</Label>
            <Input id="school" name="school" placeholder="SMP 1 Sepaku" />
          </Field>

          <Field>
            <Label htmlFor="class_name">Kelas (opsional)</Label>
            <Input id="class_name" name="class_name" placeholder="8A" />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="min. 6 karakter"
                className="pr-12"
                required
                autoComplete="new-password"
                aria-invalid={!!state?.fieldErrors?.password}
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
            {state?.fieldErrors?.password && (
              <p className="font-sans text-xs text-danger px-1">
                {state.fieldErrors.password}
              </p>
            )}
          </Field>

          <label className="flex items-start gap-3 cursor-pointer mt-3 group select-none">
            <input
              type="checkbox"
              name="guardian_aware"
              required
              className="peer sr-only"
              aria-invalid={!!state?.fieldErrors?.guardian_aware}
            />
            <span className="size-6 shrink-0 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center peer-checked:bg-primary peer-checked:[&>svg]:block mt-0.5">
              <Check
                className="size-4 text-white hidden"
                strokeWidth={3}
              />
            </span>
            <span className="font-sans text-sm text-ink leading-tight">
              Aku sudah memberi tahu orang tua/wali bahwa aku pakai aplikasi ini.
            </span>
          </label>
          {state?.fieldErrors?.guardian_aware && (
            <p className="font-sans text-xs text-danger px-1 -mt-2">
              {state.fieldErrors.guardian_aware}
            </p>
          )}

          {state?.error && (
            <div className="bg-pink-cream border-2 border-danger rounded-[8px] px-3 py-2 font-sans text-sm text-danger">
              {state.error}
            </div>
          )}
        </form>
      </main>

      <p className="text-center text-text-muted italic text-sm mb-6 px-4 font-sans">
        Datamu disimpan pribadi dan tidak dibagikan ke siapa pun.
      </p>

      <Button
        type="submit"
        form="register-form"
        size="lg"
        className="w-full mb-8"
        disabled={pending}
      >
        {pending ? "MENDAFTAR…" : "DAFTAR SEKARANG"}
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
