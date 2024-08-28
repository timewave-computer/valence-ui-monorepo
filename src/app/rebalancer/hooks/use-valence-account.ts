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
  queryFn: async () => {
    if (!walletAddress) return;
    const accounts = await fetchValenceAccounts(walletAddress);
    if (!accounts.length) return null; // wallet does not have one
    // for dev / preview
    if (process.env.NEXT_PUBLIC_ENABLE_MULTIPLE_ACCTS === "true") return null;
    else return accounts[0]; // only support one for time being
  },
});
