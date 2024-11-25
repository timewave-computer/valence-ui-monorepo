"use server";
import { getCosmwasmClient } from "@/server/rpc";
import { IndexerAuction } from "@/types/rebalancer";
import { chainConfig } from "@/const/config";
import { AuctionsManagerQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/AuctionsManager.client";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { z } from "zod";

/***
 * TODO: remove this and replace with getLiveAuctions
 */
export type FetchAuctionReturnValue = Array<{
  pair: IndexerAuction["pair"];
  address: string;
  status: string;
  isActive: boolean;
}>;

export const fetchAuctionStatuses =
  async (): Promise<FetchAuctionReturnValue> => {
    // this is needed to check auction status
    const cosmwasmClient = await getCosmwasmClient();
    const auctionsManager = new AuctionsManagerQueryClient(
      cosmwasmClient,
      chainConfig.addresses.auctionsManager,
    );
    const pairAddressTuples = await auctionsManager.getPairs({});

    const requests = pairAddressTuples.map(async (tuple) => {
      const [pair, address] = tuple;
      const auctionConfig = await getAuctionConfig(cosmwasmClient, address);
      return {
        pair,
        address,
        status: auctionConfig.status,
        isActive:
          auctionConfig.status === "started" ||
          auctionConfig.status === "finished",
      };
    });

    return Promise.all(requests);
  };

// auction client does not get generated with all the functions, doing it manually
const getAuctionConfig = async (
  client: CosmWasmClient,
  address: string,
): Promise<GetAuctionResponse> => {
  const response = await client.queryContractSmart(address, "get_auction");
  return GetAuctionResponseSchema.parse(response);
};

// based off ActiveAuction in codegen, but we only need the status
const GetAuctionResponseSchema = z.object({
  status: z.string(),
});

type GetAuctionResponse = z.infer<typeof GetAuctionResponseSchema>;
