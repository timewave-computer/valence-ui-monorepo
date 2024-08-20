"use client";
import { useWallet } from "@/hooks/use-wallet";
import { RebalancerFormHeader } from "../../create/CreateRebalancer";
import { RebalancerClient } from "@/codegen/ts-codegen/Rebalancer.client";
import { chainConfig } from "@/const/config";
import { RebalancerUpdateData } from "@/codegen/ts-codegen/Rebalancer.types";
import { useForm } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer";
import {
  BalanceReturnValue,
  useAccountConfigQuery,
} from "@/app/rebalancer/hooks";
import { QUERY_KEYS } from "@/const/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ConfigureSettings,
  SelectRebalancerTargets,
  SelectTrustee,
} from "@/app/rebalancer/create/components";
import { Button, ToastMessage } from "@/components";
import { SelectAssetsFromAccount } from "@/app/rebalancer/create/components/";
import { OriginAsset } from "@/types/ibc";
import { useMemo } from "react";
import { numberToUint128 } from "@/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AccountTarget, FetchAccountConfigReturnValue } from "@/server/actions";
import { ErrorHandler } from "@/const/error";

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
    };
  }, []);

  const form = useForm<CreateRebalancerForm>({
    // config should be populated since it is hydrated on server
    defaultValues: defaultValues,
  });

  const router = useRouter();
  const { mutate: handleUpdateRebalancer, isPending: isUpdatePending } =
    useMutation({
      mutationFn: () => updateRebalancer(convertToCosmwasm(form.getValues())),
      onError: (e) => {
        console.log("update rebalancer error", e);
        toast.error(
          <ToastMessage title="Failed to update rebalancer" variant="error">
            {ErrorHandler.constructText("", e)}
          </ToastMessage>,
        );
      },
      onSuccess: (data) => {
        toast.success(
          <ToastMessage title="Rebalancer update successful" variant="success">
            <p className="text-sm">
              Transaction:{" "}
              <span className="font-mono text-xs font-light">
                {data.transactionHash}
              </span>
            </p>
            <p className="font-semibold">Taking you to your account...</p>
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

  const updateRebalancer = async (params: RebalancerUpdateData) => {
    const cwClient = await getSigningCosmwasmClient();
    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const rebalancerClient = new RebalancerClient(
      cwClient,
      walletAddress,
      chainConfig.addresses.rebalancer,
    );

    return rebalancerClient.update({
      data: params,
      updateFor: address,
    });
  };

  return (
    <div className="flex flex-col pb-8">
      <RebalancerFormHeader address={address} isEdit={true}>
        <Button
          variant="secondary"
          className="mt-4 w-fit"
          onClick={() => {
            form.reset();
          }}
        >
          Reset changes
        </Button>
      </RebalancerFormHeader>

      <div className="flex grow flex-col flex-wrap items-start gap-8 p-4">
        <SelectAssetsFromAccount form={form} address={address} />
        <SelectRebalancerTargets
          address={address}
          form={form}
          isCleanStartingAmountEnabled={false}
        />
        <ConfigureSettings address={address} form={form} />
        <SelectTrustee address={address} form={form} />
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

const convertToCosmwasm = (
  values: CreateRebalancerForm,
): RebalancerUpdateData => {
  return {
    base_denom: values.baseTokenDenom,
    max_limit_bps: values.maxLimit
      ? {
          set: values.maxLimit,
        }
      : "clear",
    pid: {
      p: values.pid.p,
      i: values.pid.i,
      d: values.pid.d,
    },
    targets: values.targets
      .filter((t) => !!t.denom)
      .map((target) => ({
        bps: target.bps / 100,
        denom: target.denom!,
        ...(target.minimumAmount && {
          min_balance: numberToUint128(target.minimumAmount),
        }),
      })),
    target_override_strategy: values.targetOverrideStrategy,
    trustee: values.trustee
      ? {
          set: values.trustee,
        }
      : "clear",
  };
};
