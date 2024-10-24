import { MobileOverlay } from "@/components";

export default async function RebalancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex grow flex-col bg-valence-white text-valence-black">
      <MobileOverlay text="The Rebalancer is only available on desktop." />
      <div className="hidden grow overflow-clip sm:flex">{children}</div>
    </main>
  );
}
