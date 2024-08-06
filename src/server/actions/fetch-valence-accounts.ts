"use server";

import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { IndexerUrl } from "@/server/utils";
import { IndexerValenceAccountsResponseSchema } from "@/types/rebalancer";

export const fetchValenceAccounts = async (
  walletAddress: string,
): Promise<any> => {
  const res = await fetch(IndexerUrl.accounts(walletAddress));
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_VALENCE_ACCOUNTS_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();

  // if none found, empty array is returned

  const validated = IndexerValenceAccountsResponseSchema.safeParse(result);
  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_VALENCE_ACCOUNTS_ERROR}, Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }
  return validated.data;
};
