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
    queryFn: () =>
      withTimeout(
        async () => {
          return fetchHistoricalTargets({
            address: accountAddress,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          });
        },
        QUERY_KEYS.HISTORIC_TARGETS,
        10000,
      ),
  });
};

export function withTimeout<T>(
  fn: () => Promise<T>,
  key: string,
  timeoutLength: number = 5000,
) {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Request timed out. Key: ${key}`));
    }, timeoutLength);

    try {
      const result = (await fn()) as T;
      resolve(result);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}
