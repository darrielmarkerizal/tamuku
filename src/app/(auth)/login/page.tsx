import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { Mascot } from "@/components/mascot";

export default function LoginPage() {
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

        <form className="flex flex-col gap-4">
          <Field>
            <Label htmlFor="username">USERNAME</Label>
            <Input
              id="username"
              name="username"
              placeholder="namamu_di_sini"
              autoComplete="username"
              required
            />
          </Field>

          <Field>
            <Label htmlFor="password">PASSWORD</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </Field>

          <div className="flex justify-end -mt-1">
            <Link
              href="#"
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-strong hover:underline underline-offset-2"
            >
              Lupa password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full">
            MASUK
          </Button>
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
