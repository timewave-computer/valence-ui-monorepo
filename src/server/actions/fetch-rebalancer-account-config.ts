"use server";
import {
  ERROR_MESSAGES,
  ErrorHandler,
  InvalidAccountError,
} from "@/const/error";
import { chainConfig } from "@/const/config";
import { IndexerUrl } from "@/server/utils";

import { OriginAsset } from "@/types/ibc";
import {
  IndexerRebalancerConfigResponseSchema,
  RawTarget,
} from "@/types/rebalancer";
import { fetchOriginAssets } from "@/server/actions";
import { z } from "zod";

export async function fetchRebalancerAccountConfiguration({
  address,
}: {
  address: string;
}): Promise<FetchAccountConfigReturnValue> {
  const adminRequest = fetch(IndexerUrl.accountAdmin(address));

  const configRequest = fetch(IndexerUrl.accountConfig(address));

  const results = await Promise.all([adminRequest, configRequest]);
  const adminRes = results[0];
  const configRes = results[1];

  if (!adminRes.ok) {
    if (adminRes.status === 404) {
      throw new InvalidAccountError();
    }
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_ACCT_ADMIN_ERROR}, API Error: ${adminRes.status}, ${adminRes.statusText}`,
    );
  }

  const adminData = await adminRes.json();
  const admin = z.string().parse(adminData);

  if (!configRes.ok) {
    if (configRes.status === 404) {
      throw new InvalidAccountError();
    }
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_ACCT_CONFIG_ERROR}, API Error: ${configRes.status}, ${configRes.statusText}`,
    );
  }

  const configData = await configRes.json();
  const config = IndexerRebalancerConfigResponseSchema.parse(configData);
  const { targets, base_denom, pid } = config;

  const originAssets = await fetchOriginAssets(
    targets.map((target) => {
      return {
        denom: target.denom,
        chain_id: chainConfig.chain.chain_id,
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
    admin,
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
  admin: string;
  targets: AccountTarget[];
  pid: {
    p: number;
    i: number;
    d: number;
  };
  baseDenom: string;
};
