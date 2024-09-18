"use client";
import { useWallet } from "@/hooks/use-wallet";
import { RebalancerFormHeader } from "../../create/CreateRebalancer";
import { useForm } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer";
import {
  BalanceReturnValue,
  useAccountConfigQuery,
} from "@/app/rebalancer/hooks";
import { QUERY_KEYS } from "@/const/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AdvancedSettings,
  SpeedSettings,
  SetTargets,
} from "@/app/rebalancer/create/components";
import { Button, ToastMessage } from "@/components";
import { EditAssetsForAccount } from "@/app/rebalancer/edit/components/";
import { OriginAsset } from "@/types/ibc";
import { useMemo } from "react";
import { makeUpdateRebalancerMessage } from "@/app/rebalancer/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AccountTarget, FetchAccountConfigReturnValue } from "@/server/actions";
import { ErrorHandler } from "@/const/error";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "@/smol_telescope/generated-files";
import { DeliverTxResponse } from "@cosmjs/cosmwasm-stargate";

export const EditRebalancer: React.FC<{ address: string }> = ({ address }) => {
  const { address: walletAddress, getSigningCosmwasmClient } = useWallet();
  const { data: config } = useAccountConfigQuery({ account: address });
  const queryClient = useQueryClient();

  const defaultValues: CreateRebalancerForm = useMemo(() => {
    const balances = queryClient.getQueryData<BalanceReturnValue>([
      QUERY_KEYS.ACCOUNT_BALANCES,
      address,
    ]);
    const initialAmounts = !balances?.length
      ? []
      : balances.reduce(
          (acc: CreateRebalancerForm["initialAssets"], balance) => {
            const asset = queryClient.getQueryData<OriginAsset>([
              QUERY_KEYS.ORIGIN_ASSET,
              balance.denom,
            ]);
            if (asset) {
              acc.push({
                denom: balance.denom,
                startingAmount: balance.amount,
                symbol: asset?.symbol ?? "",
              });
            } else throw Error("Asset not found");
            return acc;
          },
          [] as CreateRebalancerForm["initialAssets"],
        );

    return {
      isServiceFeeIncluded: true,
      initialAssets: initialAmounts,
      baseTokenDenom: config?.baseDenom ?? "",
      targets:
        config?.targets.map((target) => ({
          denom: target.denom,
          bps: target.percentage * 100,
          minimumAmount: target.min_balance ?? undefined,
        })) ?? [],
      pid: {
        p: config?.pid.p.toString() ?? "",
        i: config?.pid.i.toString() ?? "",
        d: config?.pid.d.toString() ?? "",
      },
      targetOverrideStrategy: config?.targetOverrideStrategy ?? "priority",
    } as CreateRebalancerForm;
  }, []);

  const form = useForm<CreateRebalancerForm>({
    // config should be populated since it is hydrated on server
    defaultValues: defaultValues,
  });

  const router = useRouter();
  const { mutate: handleUpdateRebalancer, isPending: isUpdatePending } =
    useMutation({
      mutationFn: () => updateRebalancer(form.getValues()),
      onError: (e) => {
        console.log("update rebalancer error", e);
        toast.error(
          <ToastMessage title="Failed to update rebalancer" variant="error">
            {ErrorHandler.constructText("", e)}
          </ToastMessage>,
        );
      },
      onSuccess: (data: DeliverTxResponse) => {
        toast.success(
          <ToastMessage
            transactionHash={data.transactionHash}
            title="Rebalancer account updated sucessfully."
            variant="success"
          >
            <p className="text-sm">
              The most current configuration will be applied to the next
              Rebalancer cycle.
            </p>
          </ToastMessage>,
        );
        const currentVals = form.getValues();
        queryClient.setQueryData(
          [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, address],
          {
            trustee: currentVals.trustee,
            maxLimit: currentVals.maxLimit,
            baseDenom: currentVals.baseTokenDenom,
            pid: {
              p: parseFloat(currentVals.pid.p),
              i: parseFloat(currentVals.pid.i),
              d: parseFloat(currentVals.pid.d),
            },
            targets: currentVals.targets.map((t) => {
              return {
                denom: t.denom,
                min_balance: t.minimumAmount,
                percentage: t.bps / 100,
              } as AccountTarget;
            }),
          } as FetchAccountConfigReturnValue,
        );

        router.push(`/rebalancer?account=${address}`);
      },
    });

  const updateRebalancer = async (values: CreateRebalancerForm) => {
    const signer = await getSigningCosmwasmClient();

    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const messages: EncodeObject[] = [
      {
        typeUrl: MsgExecuteContract.typeUrl,
        value: makeUpdateRebalancerMessage({
          config: values,
          creatorAddress: walletAddress,
          predictableValenceAddress: address,
        }),
      },
    ];

    const result = await signer.signAndBroadcast(
      walletAddress,
      messages,
      "auto",
    );
    return result;

    // TODO: using the client fails, gives parsing error :'(
    // const rebalancerClient = new RebalancerClient(
    //   signer,
    //   walletAddress,
    //   chainConfig.addresses.rebalancer,
    // );
    // return rebalancerClient.update({
    //   data: params,
    //   updateFor: address,
    // });
  };

  return (
    <div className="flex flex-col pb-8">
      <RebalancerFormHeader
        form={form}
        address={address}
        isEdit={true}
      ></RebalancerFormHeader>

      <div className="flex grow flex-col flex-wrap items-start gap-8 p-4">
        <EditAssetsForAccount form={form} address={address} />
        <SetTargets
          address={address}
          form={form}
          isCleanStartingAmountEnabled={false}
        />
        <SpeedSettings address={address} form={form} />
        <AdvancedSettings address={address} form={form} />
        <Button
          isLoading={isUpdatePending}
          className="w-fit"
          onClick={() => handleUpdateRebalancer()}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};
