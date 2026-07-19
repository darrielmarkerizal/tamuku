import {
  SkeletonBlock,
  SkeletonCard,
  SkeletonScreen,
} from "@/components/skeleton";

export default function DashboardLoading() {
  return (
    <SkeletonScreen label="Memuat beranda">
      <header className="px-5 pt-6 pb-4 flex justify-between items-center">
        <SkeletonBlock className="h-7 w-40" />
        <div className="flex items-center gap-3">
          <SkeletonBlock className="size-10 rounded-full" />
          <SkeletonBlock className="size-10 rounded-full" />
        </div>
      </header>

      <main className="px-5 flex flex-col gap-5 mt-2">
        <SkeletonCard className="shadow-retro-lg">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-6 w-52" />
          <SkeletonBlock className="h-4 w-44" />
        </SkeletonCard>

        <SkeletonBlock className="h-[72px] w-full rounded-[12px] shadow-retro" />

        <SkeletonCard>
          <div className="flex justify-between items-start gap-3">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-6 w-24 rounded-full" />
          </div>
          <SkeletonBlock className="h-11 w-full" />
          <SkeletonBlock className="h-3 w-40 self-center" />
        </SkeletonCard>

        <SkeletonCard className="flex-row items-center gap-4">
          <SkeletonBlock className="size-[72px] rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
        </SkeletonCard>

        <div className="grid grid-cols-2 gap-4">
          <SkeletonBlock className="h-44 rounded-[12px] shadow-retro" />
          <SkeletonBlock className="h-44 rounded-[12px] shadow-retro" />
        </div>

        <SkeletonCard>
          <SkeletonBlock className="h-3 w-28" />
          <div className="flex gap-2 justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="size-10 rounded-[6px]" />
            ))}
          </div>
        </SkeletonCard>
      </main>
    </SkeletonScreen>
  );
}
