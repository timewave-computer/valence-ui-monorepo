"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { fetchValenceAccounts } from "@/server/actions";

/***
 * fetch for connected user or specific wallet address
 */
export const useValenceAccount = (walletAddress?: string) => {
  return useQuery(getValenceAccountQueryArgs(walletAddress));
};

export const getValenceAccountQueryArgs = (walletAddress?: string) => ({
  queryKey: [QUERY_KEYS.VALENCE_ACCOUNT, walletAddress],
  enabled: !!walletAddress,
  staleTime: 60 * 30 * 1000, // 30 mins, really not ever needed to refresh
  refetchInterval: 0,
  queryFn: async () => {
    if (!walletAddress) return;
    const accounts = await fetchValenceAccounts(walletAddress);
    return accounts[0]; // only support one for time being
  },
});
