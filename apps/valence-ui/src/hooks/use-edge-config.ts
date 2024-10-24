import { fetchEdgeConfig } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";

export const useEdgeConfig = () => {
  return useQuery({
    queryKey: ["edge-config"],
    queryFn: () => fetchEdgeConfig(),
  });
};
