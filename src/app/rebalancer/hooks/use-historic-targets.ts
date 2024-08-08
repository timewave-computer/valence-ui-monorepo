import { fetchHistoricalTargets } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";

export const useHistoricTargets = ({
  address,
  startDate,
  endDate,
}: {
  address: string;
  startDate: Date;
  endDate: Date;
}) => {
  return useQuery({
    staleTime: 1000 * 60 * 10, // 10 mins,
    refetchInterval: 0,
    retry: (errorCount) => {
      return errorCount < 1;
    },
    enabled: address.length > 0,
    queryKey: [QUERY_KEYS.HISTORIC_TARGETS, address, startDate, endDate],
    queryFn: () =>
      fetchHistoricalTargets({
        address,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }),
  });
};
