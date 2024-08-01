"use client";
import { Button } from "@/components";
import { useChainContext, useWallet } from "@/hooks";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { makeCreateRebalancerMessages } from "@/utils";
import { chainConfig } from "@/const/config";
import { useEffect } from "react";
import {
  SelectRebalancerTargets,
  SetStartingAmounts,
  DisplayWalletAddresses,
} from "@/app/rebalancer/create/components";

type CreateRebalancerPageProps = {
  ownerAddress: string;
};

export default function CreateRebalancerPage({
  ownerAddress,
}: CreateRebalancerPageProps) {
  const router = useRouter();
  const { getCosmWasmClient, getSigningStargateClient, isWalletConnected } =
    useChainContext();
  const { address } = useWallet();

  const form = useForm<CreateRebalancerForm>({
    defaultValues: {
      assets: [],
      baseTokenDenom: chainConfig.defaultBaseTokenDenom,
      targets: [],
      pid: {
        p: 0.2,
        i: 0,
        d: 0,
      },
      targetOverrideStrategy: "proportional",
    },
  });

  const allValues = form.watch();
  useEffect(() => {
    console.log("all values", allValues);
  }, [allValues]);

  const handleCreateRebalancer = async () => {
    // should not happen but here to make typescript happy
    if (!address) return;
    const cwClient = await getCosmWasmClient();

    // atomically create & fund valence account and register account to rebalancer
    const messages = await makeCreateRebalancerMessages({
      cosmwasmClient: cwClient,
      creatorAddress: address,
      config: form.getValues(),
    });
    const signer = await getSigningStargateClient();

    const result = await signer.signAndBroadcast(address, messages, "auto");
    console.log("create rebalancer", result);
  };

  if (!isWalletConnected) return redirect("/rebalancer");

  // temporary, can remove when support added for DAO actions
  if (ownerAddress !== address) return redirect("/rebalancer");

  return (
    <div className="flex flex-col">
      <section className="flex w-full flex-col gap-2 p-4">
        <h1 className="text-xl font-bold">
          Configure Rebalancing For Your Account{" "}
          <span className="font-mono text-sm font-medium">{`(${ownerAddress})`}</span>
        </h1>
        <Button
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push("/rebalancer");
          }}
          variant="secondary"
          className="w-fit"
        >
          Go back
        </Button>
      </section>
      <div className="flex grow flex-col flex-wrap items-start gap-14 p-4">
        <DisplayWalletAddresses form={form} address={address} />
        <SetStartingAmounts address={address} form={form} />
        <SelectRebalancerTargets address={address} form={form} />

        <section className="flex w-full flex-col gap-4">
          <div className="col-span-4 flex flex-col gap-2">
            <h1 className="text-lg font-bold">
              {CreateRebalancerCopy.step_Settings.title}
            </h1>
            <p className="text-sm">
              {CreateRebalancerCopy.step_Settings.subTitle}
            </p>
          </div>
          <div className="col-span-3"></div>
          <aside className="col-span-2"></aside>
        </section>
        <section className="flex w-full flex-col gap-4">
          <div className="col-span-4 flex flex-col gap-2">
            <h1 className="text-lg font-bold">
              {CreateRebalancerCopy.step_Trustee.title}
            </h1>
            <p className="text-sm">
              {CreateRebalancerCopy.step_Trustee.subTitle}
            </p>
          </div>
          <div className="col-span-3"></div>
          <aside className="col-span-2"></aside>
        </section>
        <Button onClick={handleCreateRebalancer}>Create Rebalancer</Button>
      </div>
    </div>
  );
}
