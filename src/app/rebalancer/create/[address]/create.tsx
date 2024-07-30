"use client";
import { Button, Dropdown, IconButton } from "@/components";
import { useChainContext, useWallet } from "@/hooks";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { redirect, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { CreateRebalancerCopy } from "../copy";
import { BsPlus, BsX } from "react-icons/bs";
import { Fragment } from "react";
import { makeTransactionMessages } from "@/utils";
import { chainConfig } from "@/const/config";
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
  const { setValue, watch, control, register } = useForm<CreateRebalancerForm>({
    defaultValues: {
      assets: [{ startingAmount: 0 }, { startingAmount: 0 }],
      baseTokenDenom: chainConfig.defaultBaseTokenDenom,
      targets: [
        {
          targetDenom: chainConfig.supportedAssets[0].denom,
          targetAmount: 0.1,
        },
        {
          targetDenom: chainConfig.supportedAssets[1].denom,
          targetAmount: 0.9,
        },
      ],
      pid: {
        p: 0.2,
        i: 0,
        d: 0,
      },
      targetOverrideStrategy: "proportional",
    },
  });

  const {
    fields: assetFields,
    append: addAsset,
    remove: removeAsset,
  } = useFieldArray({
    control,
    name: "assets",
  });

  const watchAllFields = watch(); // when pass nothing as argument, you are watching everything

  const handleCreateRebalancer = async () => {
    /***
     * on execute, generate the following messages:
     * - instantiate valence account (generated deterministically)
     * - send funds to account
     * - register account with rebalancer (with config)
     */

    // should not happen but here to make typescript happy
    if (!address) return;

    const cwClient = await getCosmWasmClient();
    console.log("inputs", watchAllFields);

    const messages = await makeTransactionMessages({
      cosmwasmClient: cwClient,
      creatorAddress: address,
      config: watchAllFields,
    });
    console.log("messages", messages);

    const signer = await getSigningStargateClient();

    const result = await signer.signAndBroadcast(address, messages, "auto");
    console.log("RESULT", result);
  };

  // disable page is wallet not connected. dont do in development because its annoying on reload
  if (!isWalletConnected && process.env.NODE_ENV !== "development")
    return redirect("/rebalancer");

  // temporary, can remove when support added for DAO actions
  if (ownerAddress !== address) return redirect("/rebalancer");

  return (
    <div className="flex grow flex-col flex-wrap items-start gap-4 p-4">
      <section className="flex w-full flex-row items-center justify-between gap-4">
        <h1 className="text-lg font-bold">
          Configure Rebalancer for Your Account{" "}
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
          Cancel
        </Button>
      </section>
      <section className="flex w-full flex-col gap-4">
        <div>
          <h1 className="font-bold">{CreateRebalancerCopy.step1.title}</h1>
          <p>{CreateRebalancerCopy.step1.subTitle}</p>
        </div>

        <div
          role="grid"
          className="grid w-1/2 grid-cols-[minmax(100px,40%)_minmax(100px,40%)_minmax(100px,40%)__minmax(44px,10%)] justify-items-start  gap-x-4"
        >
          <div role="columnheader" className="font-semibold">
            Asset
          </div>
          <div role="columnheader" className="font-semibold">
            Starting balance
          </div>
          <div role="columnheader" className="font-semibold">
            Starting value (in USDC)
          </div>
          <div
            role="columnheader"
            className="flex items-center justify-self-end p-1"
          >
            <IconButton
              Icon={BsPlus}
              disabled={
                assetFields.length === chainConfig.supportedAssets.length
              }
              onClick={() => {
                addAsset({ startingAmount: 0 });
              }}
              disabledTooltip={
                <div className="">
                  Maximum of {chainConfig.supportedAssets.length} assets
                  supported
                </div>
              }
            />
          </div>

          {assetFields.map((field, index: number) => {
            return (
              <Fragment key={`asset-select-row-${index}`}>
                <div role="gridcell" className="w-full">
                  <Dropdown
                    containerClassName="min-w-0 w-full gap-2" // need to set min w to override default style. will remove later
                    options={AssetOptions}
                    availableOptions={AssetOptions.filter(
                      (o) =>
                        !watchAllFields.assets.some((f) => f.denom === o.value),
                    )}
                    selected={watch(`assets.${index}.denom`)}
                    onSelected={(value) => {
                      setValue(`assets.${index}.denom`, value);
                    }}
                  />
                </div>
                <div role="gridcell" className="h-full w-full">
                  <input
                    className="box-border h-full max-w-full p-1"
                    type="number"
                    {...register(`assets.${index}.startingAmount`)}
                  />
                </div>
                <div role="gridcell" className="flex items-center p-1">
                  N/A
                </div>
                <div
                  role="gridcell"
                  className="flex items-center justify-self-end p-1"
                >
                  <IconButton
                    Icon={BsX}
                    disabled={assetFields.length === 2}
                    disabledTooltip={
                      <div className="">Minimum of 2 assets required.</div>
                    }
                    onClick={() => {
                      removeAsset(index);
                    }}
                  />
                </div>
              </Fragment>
            );
          })}
        </div>
      </section>
      <section className="grid grid-cols-4 gap-4">
        <div className="col-span-4 flex flex-col gap-2">
          <h1 className="font-bold">{CreateRebalancerCopy.step2.title}</h1>
          <p>{CreateRebalancerCopy.step2.subTitle}</p>
        </div>
        <div className="col-span-3"></div>
        <aside className="col-span-2"></aside>
      </section>
      <section className="grid grid-cols-4 gap-4">
        <div className="col-span-4 flex flex-col gap-2">
          <h1 className="font-bold">{CreateRebalancerCopy.step3.title}</h1>
          <p>{CreateRebalancerCopy.step3.subTitle}</p>
        </div>
        <div className="col-span-3"></div>
        <aside className="col-span-2"></aside>
      </section>
      <section className="grid grid-cols-4 gap-4">
        <div className="col-span-4 flex flex-col gap-2">
          <h1 className="font-bold">{CreateRebalancerCopy.step4.title}</h1>
          <p>{CreateRebalancerCopy.step4.subTitle}</p>
        </div>
        <div className="col-span-3"></div>
        <aside className="col-span-2"></aside>
      </section>
      <Button disabled>Review</Button>

      <Button onClick={handleCreateRebalancer}>Create</Button>
    </div>
  );
}

// TODO: needs to be actual denom
const AssetOptions = chainConfig.supportedAssets.map((asset) => {
  return {
    label: asset.symbol,
    value: asset.denom,
  };
});
