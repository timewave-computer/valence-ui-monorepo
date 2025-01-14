"use client";
import {
  Button,
  DialogClose,
  Dialog,
  DialogContent,
  LoadingIndicator,
  FormRoot,
  LoadingSkeleton,
  LinkText,
  ToastMessage,
  toast,
} from "@valence-ui/ui-components";
import { useIsServer, useWallet } from "@/hooks";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { displayValue, useDateRange } from "@/utils";
import { chainConfig } from "@/const/config";
import {
  SetTargets,
  DepositAssets,
  RebalanceSpeed,
  AdvancedSettings,
  PreviewMessage,
  useBaseTokenValue,
  useMinimumRequiredValue,
  useTestSignerConnection,
  BetaDisclaimer,
  makeCreateRebalancerMessages,
} from "@/app/rebalancer/ui";
import { ErrorHandler } from "@/const/error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { QUERY_KEYS } from "@/const/query-keys";
import { AccountTarget, FetchAccountConfigReturnValue } from "@/server/actions";
import { useCallback, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { HiMiniArrowLeft } from "react-icons/hi2";
import { VALENCE_DOMAIN, X_HANDLE, X_URL } from "@valence-ui/socials";
import { CelatoneUrl } from "@/const";

type CreateRebalancerProps = {};

export function CreateRebalancer({}: CreateRebalancerProps) {
  const router = useRouter();

  const {
    address: _walletAddress,
    isWalletConnecting,
    getCosmWasmClient,
    getSigningStargateClient,
    isWalletConnected,
  } = useWallet();

  const walletAddress = _walletAddress ?? "";
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
    initialAssets.some((asset) => {
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

  const createRebalancerAccount = useCallback(async () => {
    // should not happen but here to make typescript happy
    if (!walletAddress)
      throw new Error(
        "No address specified. Please reconnect wallet or contact @ValenceZone for help.",
      );
    const cwClient = await getCosmWasmClient();

    // atomically create & fund valence account and register account to rebalancer
    const { valenceAddress, messages } = await makeCreateRebalancerMessages({
      cosmwasmClient: cwClient,
      creatorAddress: walletAddress,
      config: form.getValues(),
    });
    const signer = await getSigningStargateClient();
    const result = await signer.signAndBroadcast(
      walletAddress,
      messages,
      "auto",
    );
    return { valenceAddress, result };
  }, [getSigningStargateClient, getCosmWasmClient, form, walletAddress]);

  const queryClient = useQueryClient();

  // for query key to do optimistic update on historical values
  const { startDate, endDate } = useDateRange();

  const { mutate: handleCreate, isPending: isCreatePending } = useMutation({
    mutationFn: createRebalancerAccount,
    onSuccess: (output: {
      valenceAddress: string;
      result: DeliverTxResponse;
    }) => {
      const { valenceAddress, result } = output;
      const formValues = form.getValues();
      const initialAssets: CreateRebalancerForm["initialAssets"] =
        formValues.initialAssets.filter(
          (initialAsset: CreateRebalancerForm["initialAssets"][number]) =>
            !!initialAsset && !!initialAsset.startingAmount,
        );

      // add config to query cache
      queryClient.setQueryData(
        [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, valenceAddress],
        {
          admin: walletAddress,
          baseDenom: formValues.baseTokenDenom,
          targetOverrideStrategy: formValues.targetOverrideStrategy,
          trustee: formValues.trustee,
          pid: {
            p: parseFloat(formValues.pid.p),
            i: parseFloat(formValues.pid.i),
            d: parseFloat(formValues.pid.d),
          },
          isPaused: false,
          maxLimit: formValues.maxLimit,
          targets: formValues.targets.map((t) => {
            return {
              denom: t.denom,
              percentage: t.bps / 100,
              min_balance: t.minimumAmount,
            } as AccountTarget;
          }),
        } as FetchAccountConfigReturnValue,
      );
      queryClient.setQueryData(
        [QUERY_KEYS.VALENCE_ACCOUNT, walletAddress],
        (old: string[] | undefined) => {
          if (!old) return [valenceAddress]; // bandaid for API call failing (only on testnet)
          return [...old, valenceAddress];
        },
      );
      queryClient.setQueryData(
        [QUERY_KEYS.ACCOUNT_BALANCES, valenceAddress],
        initialAssets.map((asset) => ({
          denom: asset.denom,
          amount: asset.startingAmount,
        })),
      );
      queryClient.setQueryData(
        [QUERY_KEYS.AUCTION_BALANCES, valenceAddress],
        [],
      );
      queryClient.setQueryData(
        [QUERY_KEYS.HISTORIC_BALANCES, valenceAddress, startDate, endDate],
        [],
      );
      queryClient.setQueryData(
        [QUERY_KEYS.HISTORIC_TARGETS, valenceAddress, startDate, endDate],
        [],
      );
      toast.success(
        <ToastMessage
          title="Rebalancer account was created and funded sucessfully."
          variant="success"
        >
          <p>
            Funds will begin rebalancing at the beginning of the next cycle.
          </p>
          <p>
            Transaction hash:{" "}
            <LinkText
              variant={"secondary"}
              blankTarget={true}
              href={CelatoneUrl.transaction(result.transactionHash)}
            >
              {result.transactionHash}
            </LinkText>
          </p>
        </ToastMessage>,
      );
      router.push(`/rebalancer?account=${valenceAddress}&scale=w`);
    },
    onError: (e) => {
      console.log(ErrorHandler.constructText("create rebalancer error", e));
      toast.error(
        <ToastMessage title="Failed to set up Rebalancer" variant="error">
          <p>{ErrorHandler.constructText("", e)}</p>
          <p>
            Try refreshing the page and reconnecting your wallet, or contact{" "}
            <LinkText variant="primary" href={X_URL} blankTarget={true}>
              {X_HANDLE}
            </LinkText>{" "}
            for help.
          </p>
        </ToastMessage>,
      );
    },
  });
  const isServer = useIsServer();

  useTestSignerConnection();

  if (isWalletConnecting) {
    return <LoadingSkeleton className="min-h-screen" />;
  }

  return (
    <div className="flex flex-col gap-2 pb-8">
      {!isServer && (
        <Dialog
          open={isBetaWarningVisible}
          defaultOpen={true}
          onOpenChange={setIsBetaWarningVisible}
        >
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
            className="max-w-[50%]"
          >
            <div className=" flex flex-col gap-4">
              <div className="flex items-center gap-4 ">
                <h1 className="text-xl font-bold  ">{BetaDisclaimer.title}</h1>
              </div>
              <div className="flex flex-col gap-2">
                {BetaDisclaimer.text.map((t, i) => (
                  <p key={`disclaimer-${i}`} className="text-sm">
                    {t}
                  </p>
                ))}
              </div>

              <div className="flex flex-row flex-wrap items-center justify-end gap-4 pt-4">
                <DialogClose asChild>
                  <Button
                    className="text no-wrap"
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
                  I agree to these terms
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <RebalancerFormHeader
        form={form}
        address={walletAddress}
        isEdit={false}
      />
      <FormRoot
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex grow flex-col flex-wrap items-start gap-8 p-4">
          <DepositAssets form={form} address={walletAddress} />
          <SetTargets
            address={walletAddress}
            form={form}
            isCleanStartingAmountEnabled={true}
          />
          <RebalanceSpeed address={walletAddress} form={form} />
          <AdvancedSettings address={walletAddress} form={form} />
          <PreviewMessage address={walletAddress} form={form} />
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
                        - Service fee of {chainConfig.serviceFee.amount}{" "}
                        {chainConfig.serviceFee.symbol} must be included with
                        the deposit.
                      </li>
                    )}

                    {!isMinimumValueMet && (
                      <li>
                        - A minimum value of{" "}
                        {displayValue({
                          value: requiredMinimumValue,
                          symbol: minimumValueSymbol,
                          options: {
                            omitDollarSignForUsdc: true,
                          },
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
      </FormRoot>
    </div>
  );
}

export const RebalancerFormHeader = ({
  isEdit,
  address,
  children,
  form,
}: {
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
  address: string;
  isEdit: boolean;
  children?: React.ReactNode;
}) => {
  const title = isEdit
    ? "Edit Rebalancer account"
    : "Set up Rebalancer account";

  const router = useRouter();

  return (
    <section className="flex w-full flex-col gap-2 p-4">
      <div className="flex flex-wrap items-center gap-1">
        <h1 className="text-xl font-bold">{title}</h1>

        {!!address.length && (
          <span className="font-mono text-sm font-medium">{`(wallet: ${address})`}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className=" max-w-60% text-wrap text-sm">
          The Rebalancer enables automated treasury management. Learn more about
          how the Rebalancer works{" "}
          <LinkText
            blankTarget={true}
            href={`https://${VALENCE_DOMAIN}/blog/Rebalancer-Protocol-Asset-Management`}
            variant="highlighted"
          >
            here
          </LinkText>
          .
        </p>

        {children}
      </div>
      <div className="flex flex-row gap-2 pt-2">
        <Button
          onClick={() => router.back()}
          className="flex w-fit flex-row gap-1 transition-all hover:bg-valence-black hover:text-valence-white"
          variant="secondary"
        >
          <HiMiniArrowLeft className="h-4 w-4" />

          <span className=" flex flex-row items-center gap-1.5 self-start">
            Go back
          </span>
        </Button>
        {isEdit && (
          // TODO: enable for create too, but rest not working for table 1
          <Button
            onClick={() => form.reset()}
            className="flex w-fit flex-row gap-1 transition-all hover:bg-valence-black hover:text-valence-white"
            variant="secondary"
          >
            Reset changes
          </Button>
        )}
      </div>
    </section>
  );
};
