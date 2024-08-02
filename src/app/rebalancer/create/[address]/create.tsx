"use client";
import { Button, LoadingIndicator } from "@/components";
import { useChainContext, useWallet } from "@/hooks";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { makeCreateRebalancerMessages } from "@/utils";
import { chainConfig } from "@/const/config";
import { toast } from "sonner";

import {
  SelectRebalancerTargets,
  SetStartingAmounts,
  DisplayWalletAddresses,
  ConfigureSettings,
  SelectTrustee,
} from "@/app/rebalancer/create/components";
import { ErrorHandler } from "@/const/error";
import { useMutation } from "@tanstack/react-query";
import { BsExclamationCircle } from "react-icons/bs";

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
        p: "0.1",
        i: "0",
        d: "0",
      },
      targetOverrideStrategy: "proportional",
    },
  });

  const createRebalancer = async () => {
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

    try {
      const result = await signer.signAndBroadcast(address, messages, "auto");
      console.log("create rebalancer", result);
    } catch (e) {
      console.log("create rebalancer error");
      toast.error(
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <BsExclamationCircle className="h-6 w-6 text-valence-red" />
            <h1 className="text-lg font-medium text-valence-red">
              Failed to set up rebalancer
            </h1>
          </div>
          <p>{ErrorHandler.constructText("", e)}</p>
        </div>,
      );
    }
  };

  const { mutate: handleCreate, isPending: isCreatePending } = useMutation({
    mutationFn: createRebalancer,
  });

  if (!isWalletConnected) return redirect("/rebalancer");

  // temporary, can remove when support added for DAO actions
  if (ownerAddress !== address) return redirect("/rebalancer");

  return (
    <div className="flex flex-col pb-8">
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
        <ConfigureSettings address={address} form={form} />
        <SelectTrustee address={address} form={form} />
        {isCreatePending ? (
          <div className="flex min-h-11 min-w-60 items-center justify-center bg-valence-black">
            {" "}
            <LoadingIndicator />{" "}
          </div>
        ) : (
          <Button className="min-h-11 min-w-60" onClick={() => handleCreate()}>
            Create Rebalancer
          </Button>
        )}
      </div>
    </div>
  );
}
