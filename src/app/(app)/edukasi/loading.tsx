import {
  SkeletonBlock,
  SkeletonCard,
  SkeletonScreen,
} from "@/components/skeleton";

export default function EdukasiLoading() {
  return (
    <SkeletonScreen label="Memuat edukasi">
      <header className="px-5 pt-8 pb-6 flex flex-col gap-2">
        <SkeletonBlock className="h-10 w-64" />
        <SkeletonBlock className="h-4 w-52" />
      </header>

      <main className="px-5 flex flex-col gap-7 pb-8">
        <SkeletonBlock className="h-56 w-full rounded-[12px] shadow-retro" />

        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock
              key={i}
              className="h-32 rounded-[12px] shadow-retro"
            />
          ))}
        </div>

        <SkeletonCard>
          <div className="flex justify-between items-center">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-5 w-16" />
          </div>
          <SkeletonBlock className="h-6 w-full rounded-full" />
        </SkeletonCard>
      </main>
    </SkeletonScreen>
  );
}
