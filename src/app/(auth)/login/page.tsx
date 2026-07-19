"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Download, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { Mascot } from "@/components/mascot";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { loginAction, type AuthState } from "@/lib/auth/actions";

const INITIAL: AuthState = {};

export default function LoginPage() {
  const { isInstallable, promptInstall } = usePwaInstall();
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <header className="flex flex-col items-center mb-8 w-full max-w-sm">
        <h1 className="font-display text-[40px] leading-none font-black uppercase tracking-tight mb-6">
          TAMUKU
        </h1>
        <div className="bg-accent-yellow border-2 border-ink shadow-retro-lg rounded-[12px] p-4 w-40 h-40 flex items-center justify-center -rotate-2">
          <Mascot state="vibrant" size={132} />
        </div>
      </header>

      <main className="w-full max-w-sm bg-surface border-2 border-ink shadow-retro rounded-[12px] p-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-extrabold uppercase text-ink-soft mb-2">
            MASUK DULU YUK
          </h2>
          <p className="font-sans text-base text-text-muted">
            Catat siklus dan TTD-mu di sini.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <Field>
            <Label htmlFor="username">USERNAME</Label>
            <Input
              id="username"
              name="username"
              placeholder="namamu_di_sini"
              autoComplete="username"
              required
              aria-invalid={!!state?.fieldErrors?.username}
            />
            {state?.fieldErrors?.username && (
              <p className="font-sans text-xs text-danger px-1">
                {state.fieldErrors.username}
              </p>
            )}
          </Field>

          <Field>
            <Label htmlFor="password">PASSWORD</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-12"
                required
                aria-invalid={!!state?.fieldErrors?.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
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

          {state?.error && (
            <div className="bg-pink-cream border-2 border-danger rounded-[8px] px-3 py-2 font-sans text-sm text-danger">
              {state.error}
            </div>
          )}

          <div className="flex justify-end -mt-1">
            <a
              href="mailto:halo@tamuku.id?subject=Lupa%20Password%20Tamuku&body=Halo%20tim%20Tamuku%2C%20saya%20lupa%20password%20akun%20saya%3A%20"
              className="label-soft text-primary-strong hover:underline underline-offset-2"
            >
              Lupa password?
            </a>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending}>
            {pending ? "MASUK…" : "MASUK"}
          </Button>

          {isInstallable && (
            <Button
              type="button"
              size="lg"
              className="mt-2 w-full bg-accent-mint hover:bg-[#7bc8a7] text-ink"
              onClick={promptInstall}
            >
              <Download className="size-5" strokeWidth={2.5} />
              INSTALL APLIKASI
            </Button>
          )}
        </form>
      </main>

      <footer className="mt-8 text-center w-full max-w-sm">
        <p className="font-sans text-base text-text-muted">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-primary-strong font-bold underline underline-offset-4 decoration-2 decoration-ink"
          >
            Daftar di sini
          </Link>
        </p>
      </footer>
    </>
  );
}
