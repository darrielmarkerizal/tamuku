import Link from "next/link";
import { Bell } from "lucide-react";
import { SyncIndicator } from "@/components/sync-indicator";

interface AppHeaderProps {
  greeting: React.ReactNode;
  hasUnread?: boolean;
}

export function AppHeader({ greeting, hasUnread = false }: AppHeaderProps) {
  return (
    <header className="px-5 pt-6 pb-4 flex justify-between items-center sticky top-0 bg-bg z-40">
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-ink flex items-center gap-2">
        {greeting}
      </h1>
      <SyncIndicator />
      <div className="flex items-center gap-3">
        <Link
          href="/profil/notifikasi"
          className="relative border-2 border-ink rounded-full p-2 bg-surface press-retro shadow-retro-sm"
          aria-label="Notifikasi"
        >
          <Bell className="size-5 text-ink" strokeWidth={2.5} />
          {hasUnread && (
            <span className="absolute top-0 right-0 size-3 bg-primary rounded-full border-2 border-ink translate-x-1 -translate-y-1" />
          )}
        </Link>
        <Link
          href="/profil"
          aria-label="Profil"
          className="size-10 rounded-full border-2 border-ink overflow-hidden bg-accent-yellow flex items-center justify-center font-display font-extrabold text-ink"
        >
          N
        </Link>
      </div>
    </header>
  );
}
