import { QUERY_KEYS } from "@/const/query-keys";
import { getPrices } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";

export const usePrice = ({ coinGeckoId }: { coinGeckoId?: string | null }) =>
  useQuery({
    staleTime: 30 * 1000, // 30 sec
    retry: (errorCount) => {
      if (errorCount > 1) {
        return false;
      }
      return true;
    },
    refetchInterval: 30 * 1000, // 30 sec
    enabled: !!coinGeckoId,
    queryKey: [QUERY_KEYS.PRICES, coinGeckoId],
    queryFn: async () => {
      const prices = await getPrices([coinGeckoId!]);
      return prices[coinGeckoId!];
    },
  });
