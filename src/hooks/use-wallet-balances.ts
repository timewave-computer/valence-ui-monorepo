import { withTimeout } from "@/app/rebalancer/hooks";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  fetchSupportedBalances,
  FetchSupportedBalancesReturnValue,
} from "@/server/actions";
import { useQuery } from "@tanstack/react-query";

export const useWalletBalances = (
  address?: string,
  options?: {
    refetchInveral?: number;
  },
) => {
  return useQuery({
    staleTime: 30 * 1000, // 30 sec
    retry: (errorCount) => {
      if (errorCount > 1) {
        return false;
      }
      return true;
    },
    refetchInterval: options?.refetchInveral ?? 30 * 1000, // 30 sec
    enabled: !!address,
    queryKey: [QUERY_KEYS.WALLET_BALANCES, address],
    queryFn: () =>
      withTimeout(
        () => fetchSupportedBalances({ address: address! }),
        QUERY_KEYS.WALLET_BALANCES,
        5000,
      ) as Promise<FetchSupportedBalancesReturnValue>,
  });
};
