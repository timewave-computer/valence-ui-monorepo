"use client";
import { Button } from "@/components";
import { useWallet } from "@/hooks";
import { redirect, useRouter } from "next/navigation";

export type CreateProps = {
  ownerAddress: string;
};

export default function CreateRebalancer({ ownerAddress }: CreateProps) {
  const router = useRouter();
  const { isConnected, address } = useWallet();

  if (!isConnected) return redirect("/rebalancer");
  // temporary, can remove when support added for DAO actions
  if (ownerAddress !== address) return redirect("/rebalancer");

  return (
    <div className="flex grow flex-col flex-wrap items-start gap-4 p-4">
      <section className="flex w-full flex-row items-center justify-between gap-4">
        <h1 className="text-lg font-bold">
          Configure Rebalancer for Your Account{" "}
          <span className="font-mono text-base font-medium">{`(${ownerAddress})`}</span>
        </h1>
        <Button
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push("/rebalancer");
          }}
          variant="secondary"
          className="w-fit"
        >
          Cancel
        </Button>
      </section>
    </div>
  );
}
