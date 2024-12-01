import { fetchHistoricalTargets } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";

export const useHistoricTargets = ({
  accountAddress,
  startDate,
  endDate,
}: {
  accountAddress: string;
  startDate: Date;
  endDate: Date;
}) => {
  return useQuery({
    staleTime: 1000 * 60 * 10, // 10 mins,
    retry: (errorCount) => {
      return errorCount < 1;
    },
    enabled: accountAddress.length > 0,
    queryKey: [
      QUERY_KEYS.HISTORIC_TARGETS,
      accountAddress,
      startDate.toISOString(),
      endDate.toISOString(),
    ],
    queryFn: () => {
      return fetchHistoricalTargets({
        address: accountAddress,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    },
  });
};
