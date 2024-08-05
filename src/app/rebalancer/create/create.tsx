"use client";
import { Button, LinkText, LoadingIndicator, RouterButton } from "@/components";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsCheck2Circle, BsExclamationCircle } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { QUERY_KEYS } from "@/const/query-keys";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { useAssetCache } from "@/app/rebalancer/hooks";

type CreateRebalancerPageProps = {};

export default function CreateRebalancerPage({}: CreateRebalancerPageProps) {
  const router = useRouter();
  const { getCosmWasmClient, getSigningStargateClient, isWalletConnected } =
    useChainContext();
  const { address } = useWallet();

  const { getAsset } = useAssetCache();

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
    if (!address)
      throw new Error(
        "No address specified. Please reconnect wallet or contact @ValenceZone for help.",
      );
    const cwClient = await getCosmWasmClient();

    // atomically create & fund valence account and register account to rebalancer
    const { messages, valenceAddress } = await makeCreateRebalancerMessages({
      cosmwasmClient: cwClient,
      creatorAddress: address,
      config: form.getValues(),
    });
    const signer = await getSigningStargateClient();
    const result = await signer.signAndBroadcast(address, messages, "auto");
    console.log("RESULT", result);
    return { valenceAddress, result };
  };
  const queryClient = useQueryClient();

  const { mutate: handleCreate, isPending: isCreatePending } = useMutation({
    mutationFn: createRebalancer,
    onSuccess: (output: {
      valenceAddress: string;
      result: DeliverTxResponse;
    }) => {
      const { valenceAddress, result } = output;
      const formValues = form.getValues();
      // add config to query cache
      queryClient.setQueryData(
        [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, valenceAddress],
        {
          baseDenom: formValues.baseTokenDenom,
          pid: {
            p: parseFloat(formValues.pid.p),
            i: parseFloat(formValues.pid.i),
            d: parseFloat(formValues.pid.d),
          },
          targets: formValues.targets.map((t) => {
            const originAsset = getAsset(t.denom);
            return {
              percentage: t.bps,
              asset: originAsset!,
            };
          }),
        } as FetchAccountConfigReturnValue,
      );

      console.log("created rebalancer at", valenceAddress, "tx:", result);
      toast.success(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BsCheck2Circle className="h-5 w-5 text-valence-blue" />
            <h1 className="text-lg font-medium text-valence-blue">
              Rebalancer setup successful
            </h1>
          </div>

          <p className="text-sm">
            Transaction:{" "}
            <span className="font-mono text-xs font-light">
              {result.transactionHash}
            </span>
          </p>

          <p className="text-sm">
            Address:{" "}
            <span className="font-mono text-xs font-light">
              {valenceAddress}
            </span>
          </p>

          <p className="font-semibold">Taking you to your account...</p>
        </div>,
      );
      router.push(`/rebalancer?account=${valenceAddress}`);
    },
    onError: (e) => {
      console.log("create rebalancer error", e);
      toast.error(
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BsExclamationCircle className="h-5 w-5 text-valence-red" />
            <h1 className="text-lg font-medium text-valence-red">
              Failed to set up rebalancer
            </h1>
          </div>
          <p>{ErrorHandler.constructText("", e)}</p>
        </div>,
      );
    },
  });

  if (!isWalletConnected || !address) return redirect("/rebalancer");

  return (
    <div className="flex flex-col pb-8">
      <section className="flex w-full flex-col gap-2 p-4">
        <RouterButton
          options={{ back: true }}
          className="flex items-center gap-2 self-start text-valence-gray hover:underline  "
        >
          <FaChevronLeft className="h-4 w-4 transition-all  " />

          <span className="text-sm font-medium tracking-tight "> Go Back</span>
        </RouterButton>
        <div className="flex flex-wrap items-center gap-1">
          <h1 className="text-xl font-bold">
            {" "}
            Create a Rebalancer Account for Connected Wallet
          </h1>

          <span className="font-mono text-sm font-medium">{`(${address})`}</span>
        </div>

        <p className="pt-2">
          To learn more about how the Rebalancer works, you can read this{" "}
          <LinkText
            className=" border-valence-blue text-valence-blue hover:border-b"
            href="/blog//Rebalancer-Protocol-Asset-Management"
          >
            blog post.
          </LinkText>
        </p>
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
