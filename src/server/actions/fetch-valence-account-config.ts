"use server";
import {
  ERROR_MESSAGES,
  ErrorHandler,
  InvalidAccountError,
} from "@/const/error";
import { NEUTRON_CHAIN_ID } from "@/const/neutron";
import { getOriginAssets, IndexerUrl } from "@/server/utils";

import { OriginAsset } from "@/types/ibc";
import {
  IndexerRebalancerConfigResponseSchema,
  RawTarget,
} from "@/types/indexer";

export async function fetchValenceAccountConfiguration({
  address,
}: {
  address: string;
}): Promise<FetchAccountConfigReturnValue> {
  const res = await fetch(IndexerUrl.accountConfig(address));
  if (!res.ok) {
    if (res.status === 404) {
      throw new InvalidAccountError();
    }
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_ACCT_CONFIG_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const data = await res.json();
  const config = IndexerRebalancerConfigResponseSchema.parse(data);
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

  return {
    baseDenom: base_denom,
    pid: {
      p: parseFloat(pid.p),
      i: parseFloat(pid.i),
      d: parseFloat(pid.d),
    },
    targets: targetsWithAsset.sort((a, b) =>
      a.asset.name.localeCompare(b.asset.name),
    ),
  };
}

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
