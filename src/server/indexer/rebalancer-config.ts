import { z } from "zod";

import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { IndexerUrl } from "@/server/indexer";

export const fetchRebalancerConfig = async (
  address: string,
): Promise<IndexerRebalancerConfigResponse> => {
  const res = await fetch(IndexerUrl.accountConfig(address));
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_ACCT_CONFIG_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();
  return Promise.resolve(IndexerRebalancerConfigResponseSchema.parse(result));
};

export const TargetSchema = z.object({
  // target denom string
  denom: z.string(),
  // Percentage of the portfolio the traget should be (between 0-1)
  percentage: z.string(),
  // Minimum balance this token should be at
  min_balance: z.string().optional().nullable(),
});
export type Target = z.infer<typeof TargetSchema>;

export const IndexerRebalancerConfigResponseSchema = z.object({
  // Trustee that can pause/resume the rebalancer for the account
  trustee: z.string().optional().nullable(),
  // The base denom this account uses
  base_denom: z.string(),
  // List of targets the account want us to rebalance
  targets: z.array(TargetSchema),
  // The PID terms the account chose, the strategy to use when doing calculations. between 0-1
  pid: z.object({
    p: z.string(),
    i: z.string(),
    d: z.string(),
  }),
  // Maximum amount we can sell in a single cycle (percentage from total portfolio value)
  max_limit: z.string().optional().nullable(),
  // When last rebalance happened in milliseconds
  last_rebalance: z.string().optional().nullable(),
  // The override strategy if we have a conflict from different parameters
  target_override_strategy: z.union([
    z.literal("proportional"),
    z.literal("priority"),
  ]),
  // If the account is currently paused or not
  is_paused: z.boolean(),
});

type IndexerRebalancerConfigResponse = z.infer<
  typeof IndexerRebalancerConfigResponseSchema
>;
