"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { fetchValenceAccounts } from "@/server/actions";

/***
 * fetch for connected user or specific wallet address
 */
export const useValenceAccountQuery = (walletAddress?: string) => {
  return useQuery(getValenceAccountQueryArgs(walletAddress));
};

export const useValenceAccount = (walletAddress?: string) => {
  const query = useValenceAccountQuery(walletAddress);
  return {
    ...query,
    data: !!query.data?.length ? query.data[0] : null,
  };
};

// just for dev, for now
export const isMultipleValenceAccountsEnabled =
  process.env.NEXT_PUBLIC_ENABLE_MULTIPLE_ACCTS === "true";
export const useMultipleValenceAccounts = (walletAddress?: string) => {
  return useValenceAccountQuery(walletAddress);
};

export const getValenceAccountQueryArgs = (walletAddress?: string) => ({
  queryKey: [QUERY_KEYS.VALENCE_ACCOUNT, walletAddress],
  enabled: !!walletAddress,
  queryFn: async () => {
    if (!walletAddress) return;
    return fetchValenceAccounts(walletAddress) as Promise<string[]>;
  },
});
