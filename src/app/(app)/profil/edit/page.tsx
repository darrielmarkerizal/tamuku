"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { Mascot } from "@/components/mascot";
import { SubpageHeader } from "@/components/subpage-header";

export default function EditProfilPage() {
  const [name, setName] = useState("Nisa Fredlina");
  const [username, setUsername] = useState("nisa.f");
  const [school, setSchool] = useState("SMP 1 Sepaku");
  const [classroom, setClassroom] = useState("8A");
  const [email, setEmail] = useState("");

  return (
    <>
      <SubpageHeader title="EDIT PROFIL" backHref="/profil" />

      <main className="px-5 flex flex-col gap-6 pb-8">
        <section className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro p-5 flex items-center gap-4">
          <div className="size-20 rounded-full border-2 border-ink bg-surface shrink-0 shadow-retro-sm flex items-center justify-center">
            <Mascot state="vibrant" size={64} />
          </div>
          <button
            type="button"
            className="bg-surface border-2 border-ink rounded-[8px] shadow-retro-sm press-retro px-4 py-2 flex items-center gap-2"
          >
            <Camera className="size-4 text-ink" strokeWidth={2.5} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
              GANTI AVATAR
            </span>
          </button>
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-5 flex flex-col gap-4">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted border-b-2 border-pink-cream pb-2">
            INFO PRIBADI
          </h2>

          <Field>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="email">Email (opsional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buat reset password kalau lupa"
            />
          </Field>
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-5 flex flex-col gap-4">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted border-b-2 border-pink-cream pb-2">
            INFO SEKOLAH
          </h2>

          <Field>
            <Label htmlFor="school">Sekolah</Label>
            <Input
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="class">Kelas</Label>
            <Input
              id="class"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              placeholder="contoh: 8A"
            />
          </Field>
        </section>

        <section className="flex flex-col gap-3 pt-2">
          <Button size="lg" className="w-full">
            SIMPAN PERUBAHAN
          </Button>
          <Button variant="ghost" size="lg" className="w-full">
            Ganti password
          </Button>
        </section>
      </main>
    </>
  );
}
