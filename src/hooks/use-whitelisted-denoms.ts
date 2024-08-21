import { withTimeout } from "@/app/rebalancer/hooks";
import { WhitelistsResponse } from "@/codegen/ts-codegen/Rebalancer.types";
import { QUERY_KEYS } from "@/const/query-keys";
import { fetchRebalancerWhitelist } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";

export const useWhitelistedDenoms = () => {
  return useQuery({
    staleTime: Infinity,
    retry: (errorCount) => {
      if (errorCount > 1) {
        return false;
      }
      return true;
    },
    refetchInterval: 0,
    queryKey: [QUERY_KEYS.REBALANCER_WHITELIST],
    queryFn: () =>
      withTimeout(
        () => fetchRebalancerWhitelist(),
        QUERY_KEYS.WALLET_BALANCES,
        5000,
      ) as Promise<WhitelistsResponse>,
  });
};
