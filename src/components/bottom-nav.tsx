"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, BookOpen, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { SECTION_TONE, type SectionKey } from "@/lib/section-tone";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  section: SectionKey;
};

const items: NavItem[] = [
  { href: "/dashboard", label: "BERANDA", Icon: Home, section: "beranda" },
  { href: "/kalender", label: "KALENDER", Icon: CalendarDays, section: "kalender" },
  { href: "/edukasi", label: "EDUKASI", Icon: BookOpen, section: "edukasi" },
  { href: "/profil", label: "PROFIL", Icon: User, section: "profil" },
];

function NavTile({ item, current }: { item: NavItem; current: boolean }) {
  const { pending } = useLinkStatus();
  const active = current || pending;

  return (
    <span
      className={cn(
        "relative flex flex-col items-center justify-center w-16 h-14 rounded-[10px] transition-all duration-200",
        active
          ? cn(
              SECTION_TONE[item.section].surface,
              "text-ink border-2 border-ink shadow-retro-sm -translate-y-0.5"
            )
          : "text-text-muted"
      )}
    >
      <item.Icon
        className={cn("size-5", active && "animate-[pop_320ms_ease-out]")}
        strokeWidth={active ? 2.75 : 2.25}
      />
      <span className="font-mono text-[10px] font-bold mt-0.5 leading-none tracking-wider">
        {item.label}
      </span>
      {pending && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 h-1 w-6 rounded-full bg-ink nav-pending"
        />
      )}
    </span>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm mb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex justify-around items-center bg-surface border-2 border-ink rounded-[16px] shadow-retro-lg px-2 py-2">
        {items.map((item) => {
          const current =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className="block"
              >
                <NavTile item={item} current={current} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
