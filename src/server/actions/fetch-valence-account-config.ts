"use server";

import { USDC } from "@/const/mock-data";
import { NEUTRON_CHAIN_ID } from "@/const/neutron";
import { getOriginAssets } from "@/server/utils";
import { OriginAsset } from "@/types/ibc";

export async function fetchValenceAccountConfiguration({
  address,
}: {
  address: string;
}): Promise<FetchAccountConfigReturnValue> {
  const pid = {
    kp: 0.4,
    ki: 0.2,
    kd: 0.1,
  };
  const baseDenom = USDC;
  const targets = TARGETS;
  const originAssets = await getOriginAssets(
    targets.map((target, i) => {
      return {
        denom: target.denom,
        chain_id: NEUTRON_CHAIN_ID,
      };
    }),
  );
  const targetsWithAsset: AccountTarget[] = targets.map((t, i) => {
    return {
      ...t,
      asset: originAssets[i].asset,
    };
  });

  return Promise.resolve({
    baseDenom,
    pid,
    targets: targetsWithAsset,
  });
}

const TARGETS: Array<Omit<AccountTarget, "asset">> = [
  {
    denom: "untrn",
    percent: 0.1,
  },
  {
    denom: USDC,
    percent: 0.9,
  },
];

export type AccountTarget = {
  denom: string;
  asset: OriginAsset;
  percent: number;
};

export type FetchAccountConfigReturnValue = {
  baseDenom: string;
  targets: AccountTarget[];
  pid: {
    kp: number;
    ki: number;
    kd: number;
  };
};
