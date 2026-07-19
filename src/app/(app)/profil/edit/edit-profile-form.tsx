"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { Mascot } from "@/components/mascot";
import { SubpageHeader } from "@/components/subpage-header";
import { updateProfileAction } from "@/lib/profile/actions";

interface Props {
  initial: {
    name: string;
    email: string;
    username: string;
    school: string;
    class_name: string;
  };
}

export function EditProfileForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [school, setSchool] = useState(initial.school);
  const [className, setClassName] = useState(initial.class_name);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string>
  >({});
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("email", email);
      fd.set("school", school);
      fd.set("class_name", className);
      const res = await updateProfileAction(fd);
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error);
        setFieldErrors(res.fieldErrors ?? {});
      }
    });
  }

  return (
    <>
      <SubpageHeader title="EDIT PROFIL" backHref="/profil" />

      <form
        onSubmit={handleSubmit}
        className="px-5 flex flex-col gap-6 pb-8"
      >
        <section className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro p-5 flex items-center gap-4">
          <div className="size-20 rounded-full border-2 border-ink bg-surface shrink-0 shadow-retro-sm flex items-center justify-center">
            <Mascot state="vibrant" size={64} />
          </div>
          <p className="font-sans text-sm text-ink">
            Maskot kamu berubah sesuai kepatuhan minum TTD.
          </p>
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-5 flex flex-col gap-4">
          <h2 className="label-micro text-text-muted border-b-2 border-pink-cream pb-2">
            INFO PRIBADI
          </h2>

          <Field>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && (
              <p className="font-sans text-xs text-danger px-1">
                {fieldErrors.name}
              </p>
            )}
          </Field>

          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={initial.username}
              disabled
              className="opacity-60"
            />
            <p className="font-sans text-[10px] text-text-muted px-1">
              Username nggak bisa diubah.
            </p>
          </Field>

          <Field>
            <Label htmlFor="email">Email (opsional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buat reset password kalau lupa"
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <p className="font-sans text-xs text-danger px-1">
                {fieldErrors.email}
              </p>
            )}
          </Field>
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-5 flex flex-col gap-4">
          <h2 className="label-micro text-text-muted border-b-2 border-pink-cream pb-2">
            INFO SEKOLAH
          </h2>

          <Field>
            <Label htmlFor="school">Sekolah</Label>
            <Input
              id="school"
              name="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="class_name">Kelas</Label>
            <Input
              id="class_name"
              name="class_name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="contoh: 8A"
            />
          </Field>
        </section>

        {error && (
          <div className="bg-pink-cream border-2 border-danger rounded-[8px] px-3 py-2 font-sans text-sm text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-accent-mint border-2 border-ink rounded-[8px] px-3 py-2 font-sans text-sm text-ink">
            Berhasil disimpan.
          </div>
        )}

        <section className="flex flex-col gap-3 pt-2">
          <Button size="lg" className="w-full" type="submit" disabled={pending}>
            {pending ? "MENYIMPAN…" : "SIMPAN PERUBAHAN"}
          </Button>
        </section>
      </form>
    </>
  );
}
