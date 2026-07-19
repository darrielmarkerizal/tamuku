import {
  SkeletonBlock,
  SkeletonCard,
  SkeletonScreen,
} from "@/components/skeleton";

export default function ProfilLoading() {
  return (
    <SkeletonScreen label="Memuat profil">
      <header className="px-5 pt-6 pb-2 flex justify-between items-center">
        <SkeletonBlock className="h-7 w-28" />
        <SkeletonBlock className="size-10 rounded-full" />
      </header>

      <main className="flex-1 px-5 pt-4 pb-8 flex flex-col gap-7">
        <SkeletonCard className="flex-row items-center gap-4 shadow-retro">
          <SkeletonBlock className="size-20 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-5 w-52 rounded-full" />
          </div>
        </SkeletonCard>

        <div className="flex gap-3 -mx-5 px-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock
              key={i}
              className="h-28 min-w-[130px] rounded-[12px]"
            />
          ))}
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-baseline">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-3 w-12" />
          </div>
          <div className="grid grid-cols-3 gap-y-6 gap-x-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <SkeletonBlock className="size-16 rounded-full" />
                <SkeletonBlock className="h-3 w-16" />
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock
              key={i}
              className="h-[60px] w-full rounded-[12px] shadow-retro"
            />
          ))}
        </div>
      </main>
    </SkeletonScreen>
  );
}
