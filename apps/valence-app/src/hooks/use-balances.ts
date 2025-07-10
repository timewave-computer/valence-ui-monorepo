import { QUERY_KEYS } from "@/const/query-keys";
import { Coin, StargateClient } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";

export const useDenomBalance = ({
  denom,
  rpcUrl,
  address,
  options,
}: {
  denom?: string;
  rpcUrl?: string;
  address?: string;
  options?: {
    refetchInveral?: number;
  };
}): ReturnType<typeof useQuery<Coin | undefined>> => {
  return useQuery({
    staleTime: 30 * 1000, // 30 sec
    retry: (errorCount) => {
      if (errorCount > 1) {
        return false;
      }
      return true;
    },
    refetchInterval: options?.refetchInveral ?? 30 * 1000, // 30 sec
    enabled: !!address && !!rpcUrl && !!denom,
    queryKey: [QUERY_KEYS.ASSET_BALANCE, address, rpcUrl, denom],
    queryFn: async () => {
      if (!rpcUrl)
        throw new Error("Attempted to fetch denom balance with undefined rpc");
      if (!address)
        throw new Error(
          "Attempted to fetch denom balance with undefined address",
        );
      if (!denom)
        throw new Error(
          "Attempted to fetch denom balance with undefined denom",
        );
      const stargateClient = await StargateClient.connect(rpcUrl);
      return stargateClient.getBalance(address, denom);
    },
  });
};

export const useWalletBalances = ({
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
    queryKey: [QUERY_KEYS.WALLET_BALANCES, address, rpcUrl],
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
