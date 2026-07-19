import {
  SkeletonBlock,
  SkeletonCard,
  SkeletonScreen,
} from "@/components/skeleton";

export default function TtdLoading() {
  return (
    <SkeletonScreen label="Memuat halaman TTD">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <SkeletonBlock className="size-10" />
        <SkeletonBlock className="h-7 w-32" />
      </header>

      <main className="px-5 flex flex-col gap-6">
        <SkeletonBlock className="h-32 w-full rounded-[12px] shadow-retro-lg" />

        <SkeletonCard>
          <SkeletonBlock className="h-3 w-32" />
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <SkeletonBlock key={i} className="aspect-square rounded-[6px]" />
            ))}
          </div>
        </SkeletonCard>

        <SkeletonBlock className="h-14 w-full rounded-[12px] shadow-retro" />
      </main>
    </SkeletonScreen>
  );
}
