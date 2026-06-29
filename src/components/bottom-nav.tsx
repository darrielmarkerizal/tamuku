"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, BookOpen, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const items: NavItem[] = [
  { href: "/dashboard", label: "BERANDA", Icon: Home },
  { href: "/kalender", label: "KALENDER", Icon: CalendarDays },
  { href: "/edukasi", label: "EDUKASI", Icon: BookOpen },
  { href: "/profil", label: "PROFIL", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 bg-surface h-20 border-t-2 border-ink pb-[env(safe-area-inset-bottom)]"
    >
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all",
              active
                ? "bg-pink-soft text-ink border-2 border-ink shadow-retro-sm -translate-y-1"
                : "text-text-muted hover:bg-pink-cream"
            )}
          >
            <Icon className="size-6" strokeWidth={active ? 2.75 : 2.25} />
            <span className="font-mono text-[10px] font-bold mt-0.5 leading-none">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
