import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SubpageHeaderProps {
  title: string;
  backHref: string;
  rightSlot?: React.ReactNode;
}

export function SubpageHeader({ title, backHref, rightSlot }: SubpageHeaderProps) {
  return (
    <header className="px-5 pt-6 pb-4 flex items-center gap-3 sticky top-0 z-30 bg-bg">
      <Link
        href={backHref}
        aria-label="Kembali"
        className="size-10 -ml-2 rounded-full hover:bg-pink-cream flex items-center justify-center transition-colors"
      >
        <ArrowLeft className="size-6 text-ink" strokeWidth={2.5} />
      </Link>
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink flex-1 truncate">
        {title}
      </h1>
      {rightSlot}
    </header>
  );
}
