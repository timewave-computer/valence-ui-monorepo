"use server";
import { NEUTRON_CHAIN_ID } from "@/const/neutron";
import { getOriginAssets } from "@/server/utils";
import {
  Target as RawTarget,
  fetchRebalancerConfig,
} from "@/server/indexer/rebalancer-config";
import { OriginAsset } from "@/types/ibc";

export type AccountTarget = Omit<RawTarget, "percentage"> & {
  percentage: number;
  asset: OriginAsset;
};

export type FetchAccountConfigReturnValue = {
  targets: AccountTarget[];
  pid: {
    p: number;
    i: number;
    d: number;
  };
  baseDenom: string;
};

export async function fetchValenceAccountConfiguration({
  address,
}: {
  address: string;
}): Promise<FetchAccountConfigReturnValue> {
  const config = await fetchRebalancerConfig(address);
  const { targets, base_denom, pid } = config;

  const originAssets = await getOriginAssets(
    targets.map((target) => {
      return {
        denom: target.denom,
        chain_id: NEUTRON_CHAIN_ID,
      };
    }),
  );
  const targetsWithAsset = targets.map((t, i) => {
    return {
      ...t,
      percentage: parseFloat(t.percentage),
      asset: originAssets[i].asset,
    };
  });

  return Promise.resolve({
    baseDenom: base_denom,
    pid: {
      p: parseFloat(pid.p),
      i: parseFloat(pid.i),
      d: parseFloat(pid.d),
    },
    targets: targetsWithAsset,
  });
}
