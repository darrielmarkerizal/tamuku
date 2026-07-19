import {
  SkeletonBlock,
  SkeletonCard,
  SkeletonScreen,
} from "@/components/skeleton";

export default function KalenderLoading() {
  return (
    <SkeletonScreen label="Memuat kalender">
      <header className="px-5 pt-6 pb-4 flex justify-between items-center">
        <SkeletonBlock className="h-7 w-36" />
        <div className="flex items-center gap-3">
          <SkeletonBlock className="size-10 rounded-full" />
          <SkeletonBlock className="size-10 rounded-full" />
        </div>
      </header>

      <main className="px-5 flex flex-col gap-6 mt-2">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="size-10 shadow-retro" />
          <SkeletonBlock className="h-7 w-40" />
          <SkeletonBlock className="size-10 shadow-retro" />
        </div>

        <div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-4 w-4 mx-auto rounded-[4px]" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
            {Array.from({ length: 35 }).map((_, i) => (
              <SkeletonBlock key={i} className="size-10" />
            ))}
          </div>
        </div>

        <SkeletonCard className="flex-row flex-wrap gap-4 justify-center items-center p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-4 w-24" />
          ))}
        </SkeletonCard>

        <SkeletonBlock className="h-14 w-full rounded-[12px] shadow-retro" />
        <SkeletonBlock className="h-40 w-full rounded-[12px] shadow-retro-lg" />
      </main>
    </SkeletonScreen>
  );
}
