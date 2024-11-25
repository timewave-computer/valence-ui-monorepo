"use server";
import { getCosmwasmClient } from "@/server/rpc";
import { chainConfig } from "@/const/config";
import { MinAmount } from "@valence-ui/generated-types/dist/cosmwasm/types/AuctionsManager.types";
import { AuctionsManagerQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/AuctionsManager.client";

/***
 * for surfacing whether upcoming trade is above the minimum
 */
export const fetchAuctionLimits = async (): Promise<
  Array<{ denom: string; data: MinAmount }>
> => {
  const cosmwasmClient = await getCosmwasmClient();
  const auctionsManager = new AuctionsManagerQueryClient(
    cosmwasmClient,
    chainConfig.addresses.auctionsManager,
  );
  const limitRequests = chainConfig.supportedAssets.map(async (asset) => {
    return {
      denom: asset.denom,
      data: await auctionsManager.getMinLimit({
        denom: asset.denom,
      }),
    };
  });

  return Promise.all(limitRequests);
};
