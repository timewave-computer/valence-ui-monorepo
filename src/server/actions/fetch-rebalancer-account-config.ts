"use server";
import {
  ERROR_MESSAGES,
  ErrorHandler,
  InvalidAccountError,
} from "@/const/error";
import { IndexerUrl } from "@/server/utils";
import {
  IndexerPausedAccountSchema,
  IndexerRebalancerAccountConfig,
  IndexerRebalancerConfigResponseSchema,
  RawTarget,
  TargetOverrideStrategy,
} from "@/types/rebalancer";
import { z } from "zod";

export async function fetchRebalancerAccountConfiguration({
  address,
}: {
  address: string;
}): Promise<FetchAccountConfigReturnValue> {
  const adminRequest = fetch(IndexerUrl.accountAdmin(address), {
    next: {
      revalidate: 5, // 5 minutes
    },
  });

  const configRequest = fetch(IndexerUrl.accountConfig(address), {
    next: {
      revalidate: 5, // 5 minutes
    },
  });

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

  let config: IndexerRebalancerAccountConfig;
  const checkIfPaused = IndexerPausedAccountSchema.safeParse(configData);

  if (checkIfPaused.success) {
    config = {
      ...checkIfPaused.data.config,
      is_paused: true,
    };
  } else {
    config = IndexerRebalancerConfigResponseSchema.parse(configData);
  }
  const { targets, base_denom, pid } = config;

  const targetsFormatted = targets.map((t) => ({
    ...t,
    min_balance: t.min_balance ? parseFloat(t.min_balance) : null,
    percentage: parseFloat(t.percentage),
  }));

  return {
    admin,
    trustee: config.trustee ?? null,
    isPaused: config.is_paused,
    baseDenom: base_denom,
    pid: {
      p: parseFloat(pid.p),
      i: parseFloat(pid.i),
      d: parseFloat(pid.d),
    },
    targets: targetsFormatted,
    targetOverrideStrategy: config.target_override_strategy,
    maxLimit: config.max_limit ? parseFloat(config.max_limit) : undefined,
  };
}

export type AccountTarget = Omit<RawTarget, "percentage" | "min_balance"> & {
  percentage: number;
  min_balance: number | null;
};

export type FetchAccountConfigReturnValue = {
  admin: string;
  trustee: string | null;
  targets: AccountTarget[];
  pid: {
    p: number;
    i: number;
    d: number;
  };
  baseDenom: string;
  isPaused: boolean;
  targetOverrideStrategy: TargetOverrideStrategy;
  maxLimit?: number;
};
