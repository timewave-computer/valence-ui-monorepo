"use server";
import { WhitelistsResponse } from "@/codegen/ts-codegen/Rebalancer.types";
import { chainConfig } from "@/const/config";
import { getCosmwasmClient } from "@/server/utils";

export async function fetchRebalancerWhitelist(): Promise<WhitelistsResponse> {
  const cowsmwasmClient = await getCosmwasmClient();

  const result = await cowsmwasmClient.queryContractSmart(
    chainConfig.addresses.rebalancer,
    "get_white_lists",
  );
  return result as WhitelistsResponse;
}
