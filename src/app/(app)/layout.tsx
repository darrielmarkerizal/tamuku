import { BottomNav } from "@/components/bottom-nav";
import { HydrateOffline } from "@/components/hydrate-offline";
import { IosInstallHint } from "@/components/ios-install-hint";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full max-w-md mx-auto flex flex-col bg-bg pb-32">
      <HydrateOffline />
      {children}
      <IosInstallHint />
      <BottomNav />
    </div>
  );
}
