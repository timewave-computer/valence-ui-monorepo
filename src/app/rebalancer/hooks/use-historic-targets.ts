import { fetchHistoricalTargets } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { IndexerHistoricalTargetsResponse } from "@/types/rebalancer";

export const useHistoricTargets = ({
  rebalancerAddress,
  startDate,
  endDate,
}: {
  rebalancerAddress: string;
  startDate: Date;
  endDate: Date;
}) => {
  return useQuery({
    staleTime: 1000 * 60 * 10, // 10 mins,
    retry: (errorCount) => {
      return errorCount < 1;
    },
    enabled: rebalancerAddress.length > 0,
    queryKey: [
      QUERY_KEYS.HISTORIC_TARGETS,
      rebalancerAddress,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      return new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Request timed out"));
        }, 5000);

        try {
          const history = (await fetchHistoricalTargets({
            address: rebalancerAddress,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          })) as IndexerHistoricalTargetsResponse;
          resolve(history);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    },
  });
};
