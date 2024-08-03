import { QUERY_KEYS } from "@/const/query-keys";
import { fetchRebalancerAccountConfiguration } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LOAD_CONFIG_ERROR } from "@/app/rebalancer/const";
import { ERROR_CODES, InvalidAccountError } from "@/const/error";

export const useAccountConfigQuery = ({
  account,
  enabled = true,
}: {
  account: string;
  enabled?: boolean;
}) => {
  // maintain custom error state
  const [error, setError] = useState<null | LOAD_CONFIG_ERROR>(null);
  const query = useQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchInterval: 0,
    queryKey: [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, account],
    queryFn: async () => {
      setError(null);
      try {
        return await fetchRebalancerAccountConfiguration({
          address: account,
        });
      } catch (e) {
        let error = e as unknown as { name?: string; message?: string };
        // intercept account not found error
        // have to do it this way because server action -> client loses context of erorr instance
        if (error.name === ERROR_CODES.InvalidAccountError) {
          setError(LOAD_CONFIG_ERROR.INVALID_ACCOUNT);
        } else {
          setError(LOAD_CONFIG_ERROR.API_ERROR);
        }
        throw e;
      }
    },
    enabled,
  });

  return { ...query, error };
};
