import { withTimeout } from "@/app/rebalancer/ui";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  fetchSupportedBalances,
  FetchSupportedBalancesReturnValue,
} from "@/server/actions";
import { Coin, StargateClient } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";

// TODO: add asset filter and delete v1
export const useWalletBalancesV2 = ({
  rpcUrl,
  address,
  options,
}: {
  rpcUrl?: string;
  address?: string;
  options?: {
    refetchInveral?: number;
  };
}): ReturnType<typeof useQuery<Coin[]>> => {
  return useQuery({
    staleTime: 30 * 1000, // 30 sec
    retry: (errorCount) => {
      if (errorCount > 1) {
        return false;
      }
      return true;
    },
    refetchInterval: options?.refetchInveral ?? 30 * 1000, // 30 sec
    enabled: !!address && !!rpcUrl,
    queryKey: [QUERY_KEYS.WALLET_BALANCES_V2, address, rpcUrl],
    queryFn: async () => {
      if (!rpcUrl)
        throw new Error("Attempted to fetch balances with undefined rpc");
      if (!address)
        throw new Error("Attempted to fetch balances with undefined address");
      const stargateClient = await StargateClient.connect(rpcUrl);
      return stargateClient.getAllBalances(address);
    },
  });
};

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
