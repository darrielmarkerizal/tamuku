import { BottomNav } from "@/components/bottom-nav";
import { HydrateOffline } from "@/components/hydrate-offline";
import { IosInstallHint } from "@/components/ios-install-hint";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-bg pb-32">
      <HydrateOffline />
      {children}
      <IosInstallHint />
      <BottomNav />
    </div>
  );
}
