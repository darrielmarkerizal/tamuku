"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Yakin mau keluar?")) return;
    startTransition(() => logoutAction());
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="w-full bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center justify-between press-retro mt-3 disabled:opacity-70"
    >
      <div className="flex items-center gap-3">
        <LogOut className="size-5 text-danger" strokeWidth={2.5} />
        <span className="font-sans text-base text-danger font-bold">
          {pending ? "Keluar…" : "Keluar"}
        </span>
      </div>
    </button>
  );
}
