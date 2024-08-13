"use client";
import {
  Button,
  LinkText,
  LoadingIndicator,
  RouterButton,
  ToastMessage,
} from "@/components";
import { useWallet } from "@/hooks";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { makeCreateRebalancerMessages } from "@/utils";
import { chainConfig } from "@/const/config";
import { toast } from "sonner";
import {
  SelectRebalancerTargets,
  SelectAmounts,
  ConfigureSettings,
  SelectTrustee,
} from "@/app/rebalancer/create/components";
import { ErrorHandler } from "@/const/error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaChevronLeft } from "react-icons/fa";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { QUERY_KEYS } from "@/const/query-keys";
import { AccountTarget, FetchAccountConfigReturnValue } from "@/server/actions";
import { useCallback } from "react";

type CreateRebalancerPageProps = {};

export default function CreateRebalancerPage({}: CreateRebalancerPageProps) {
  const router = useRouter();

  const {
    address,
    isWalletConnected,
    getCosmWasmClient,
    getSigningStargateClient,
  } = useWallet();

  const form = useForm<CreateRebalancerForm>({
    defaultValues: {
      initialAssets: [],
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

  const createRebalancer = useCallback(async () => {
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
    return { valenceAddress, result };
  }, [getSigningStargateClient, getCosmWasmClient, form, address]);
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
          admin: address,
          baseDenom: formValues.baseTokenDenom,
          pid: {
            p: parseFloat(formValues.pid.p),
            i: parseFloat(formValues.pid.i),
            d: parseFloat(formValues.pid.d),
          },
          targets: formValues.targets.map((t) => {
            return {
              percentage: t.bps / 100,
            } as AccountTarget;
          }),
        } as FetchAccountConfigReturnValue,
      );
      queryClient.setQueryData([QUERY_KEYS.VALENCE_ACCOUNT], valenceAddress);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, valenceAddress],
      });

      console.log("created rebalancer at", valenceAddress, "tx:", result);
      toast.success(
        <ToastMessage title="Rebalancer setup successful" variant="success">
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
        </ToastMessage>,
      );
      router.push(`/rebalancer?account=${valenceAddress}`);
    },
    onError: (e) => {
      console.log("create rebalancer error", e);
      toast.error(
        <ToastMessage title="Failed to set up rebalancer" variant="error">
          {ErrorHandler.constructText("", e)}
        </ToastMessage>,
      );
    },
  });

  if (!isWalletConnected || !address) {
    return redirect("/rebalancer");
  }

  return (
    <div className="flex flex-col pb-8">
      <section className="flex w-full flex-col gap-2 p-4 pb-12">
        <RouterButton
          options={{ back: true }}
          className="flex items-center gap-2 self-start text-valence-gray hover:underline  "
        >
          <FaChevronLeft className="h-4 w-4 transition-all" />

          <span className="text-sm font-medium tracking-tight "> Go Back</span>
        </RouterButton>
        <div className="flex flex-wrap items-center gap-1">
          <h1 className="text-xl font-bold">
            Create a Rebalancer Account for Connected Wallet
          </h1>

          <span className="font-mono text-sm font-medium">{`(${address})`}</span>
        </div>

        <p className="pt-2 text-sm">
          To learn more about how the Rebalancer works, you can read this{" "}
          <LinkText
            className=" border-valence-blue text-valence-blue hover:border-b"
            href="/blog//Rebalancer-Protocol-Asset-Management"
          >
            blog post.
          </LinkText>
        </p>
      </section>
      <div className="flex grow flex-col flex-wrap items-start gap-12 p-4">
        <SelectAmounts form={form} address={address} />
        <SelectRebalancerTargets address={address} form={form} />
        <ConfigureSettings address={address} form={form} />
        <SelectTrustee address={address} form={form} />
        {isCreatePending ? (
          <div className="flex min-h-11 min-w-60 items-center justify-center bg-valence-black">
            <LoadingIndicator />
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
