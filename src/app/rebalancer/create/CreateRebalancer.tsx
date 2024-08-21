"use client";
import {
  Button,
  DialogClose,
  LinkText,
  LoadingIndicator,
  RouterButton,
  ToastMessage,
} from "@/components";
import { useWallet, useWhitelistedDenoms } from "@/hooks";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { displayValue, makeCreateRebalancerMessages } from "@/utils";
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
import {
  AccountTarget,
  FetchAccountConfigReturnValue,
  fetchRebalancerWhitelist,
} from "@/server/actions";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { CelatoneUrl } from "@/const/celatone";
import { useBaseTokenValue, useMinimumRequiredValue } from "../hooks";

type CreateRebalancerProps = {};

export default function CreateRebalancer({}: CreateRebalancerProps) {
  const router = useRouter();

  const {
    address,
    isWalletConnected,
    getCosmWasmClient,
    getSigningStargateClient,
  } = useWallet();

  const { data: whitelist } = useWhitelistedDenoms();

  const form = useForm<CreateRebalancerForm>({
    defaultValues: {
      isServiceFeeIncluded: false,
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

  const [isBetaWarningVisible, setIsBetaWarningVisible] = useState(true);

  const initialAssets = form.watch("initialAssets");
  const targets = form.watch("targets");
  const baseDenom = form.watch("baseTokenDenom");
  const isServiceFeeIncluded = form.watch("isServiceFeeIncluded");

  const isDepositsValid =
    initialAssets.every((asset) => {
      return !!asset?.startingAmount && asset.startingAmount > 0;
    }) && initialAssets.length > 0;

  const { calculateValue } = useBaseTokenValue({
    baseTokenDenom: baseDenom,
  });

  const isTargetsValid =
    targets.length >= 2 &&
    targets.every((t) => t.bps > 0 && t.bps < 100 && !!t.denom) &&
    targets.reduce((acc, t) => acc + t.bps, 0) === 100;

  const { value: requiredMinimumValue, symbol: minimumValueSymbol } =
    useMinimumRequiredValue(baseDenom);

  const totalValue = initialAssets.reduce((acc, asset) => {
    const _value = calculateValue({
      amount: Number(asset.startingAmount),
      denom: asset.denom,
    });
    const value = isNaN(_value) ? 0 : _value;
    return acc + value;
  }, 0);

  const isMinimumValueMet = totalValue >= requiredMinimumValue;

  const isSubmitEnabled =
    isDepositsValid &&
    isTargetsValid &&
    isServiceFeeIncluded &&
    isMinimumValueMet;

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
          <LinkText
            className="group"
            href={CelatoneUrl.trasaction(result.transactionHash)}
          >
            <p className="text-sm transition-all group-hover:underline">
              Transaction:{" "}
              <span className="font-mono text-xs font-light transition-all group-hover:underline">
                {result.transactionHash}
              </span>
            </p>
          </LinkText>
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
    <div className="flex flex-col gap-2 pb-8">
      <Dialog
        open={isBetaWarningVisible}
        defaultOpen={true}
        onOpenChange={setIsBetaWarningVisible}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className=" max-w-[40%]"
        >
          <div className=" flex flex-col gap-2">
            <div className="flex items-center gap-2 ">
              <h1 className="text-xl font-bold  ">This feature is in beta.</h1>
            </div>
            <p className="text-sm">
              By continuing, you accept the risks associated with using beta
              software.
            </p>
            <div className="no-wrap flex flex-row items-center justify-end gap-4 pt-4">
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  variant="secondary"
                >
                  Go back
                </Button>
              </DialogClose>
              <Button
                className=""
                onClick={() => setIsBetaWarningVisible(false)}
                variant="primary"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <RebalancerFormHeader address={address} isEdit={false} />
      <div className="flex grow flex-col flex-wrap items-start gap-8 p-4">
        <SelectAmounts form={form} address={address} />
        <SelectRebalancerTargets
          address={address}
          form={form}
          isCleanStartingAmountEnabled={true}
        />
        <ConfigureSettings address={address} form={form} />
        <SelectTrustee address={address} form={form} />
        {isCreatePending ? (
          <div className="flex min-h-11 min-w-60 items-center justify-center bg-valence-black">
            <LoadingIndicator />
          </div>
        ) : (
          <HoverCard openDelay={0}>
            <HoverCardTrigger>
              <Button
                disabled={!isSubmitEnabled}
                className="min-h-11 min-w-60"
                onClick={() => (isSubmitEnabled ? handleCreate() : {})}
              >
                Start rebalancing
              </Button>
            </HoverCardTrigger>
            {!isSubmitEnabled && (
              <HoverCardContent className="flex flex-col gap-1 border border-valence-black bg-valence-lightgray p-4 text-sm text-valence-black">
                <h2 className="font-semibold">
                  Configuration does not meet the below requirements:
                </h2>
                <ul>
                  {!isServiceFeeIncluded && (
                    <li className="">
                      - A service fee of {chainConfig.serviceFee.amount}{" "}
                      {chainConfig.serviceFee.symbol} must be included with the
                      deposit.
                    </li>
                  )}

                  {!isMinimumValueMet && (
                    <li>
                      - A minimum value of{" "}
                      {displayValue({
                        value: requiredMinimumValue,
                        symbol: minimumValueSymbol,
                      })}{" "}
                      must be deposited to the account.
                    </li>
                  )}

                  {!isDepositsValid && (
                    <li>- At least 1 asset should be selected to deposit.</li>
                  )}

                  {!isTargetsValid && (
                    <li>
                      - At least 2 targets should be selected, adding up to
                      100%.
                    </li>
                  )}
                </ul>
              </HoverCardContent>
            )}
          </HoverCard>
        )}
      </div>
    </div>
  );
}

export const RebalancerFormHeader = ({
  isEdit,
  address,
  children,
}: {
  address: string;
  isEdit: boolean;
  children?: React.ReactNode;
}) => {
  const title = isEdit
    ? "Edit Rebalancer Account"
    : "Set up a Rebalancer account for this wallet";
  return (
    <section className="flex w-full flex-col gap-2 p-4">
      <RouterButton
        options={{ back: true }}
        className="flex items-center gap-2 self-start text-valence-gray hover:underline  "
      >
        <FaChevronLeft className="h-4 w-4 transition-all" />

        <span className="text-sm font-medium tracking-tight "> Go Back</span>
      </RouterButton>
      <div className="flex flex-wrap items-center gap-1">
        <h1 className="text-xl font-bold">{title}</h1>

        <span className="font-mono text-sm font-medium">{`(${address})`}</span>
      </div>
      <div className="flex flex-col gap-1">
        <p className=" max-w-60% text-wrap text-sm">
          Learn more about how the Rebalancer works{" "}
          <LinkText
            openInNewTab={true}
            className=" border-valence-blue text-valence-blue hover:border-b"
            href="/blog//Rebalancer-Protocol-Asset-Management"
          >
            here
          </LinkText>
          .
        </p>

        {children}
      </div>
    </section>
  );
};
