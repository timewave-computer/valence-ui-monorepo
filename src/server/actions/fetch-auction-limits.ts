"use server";
import { getCosmwasmClient } from "@/server/utils";
import { chainConfig } from "@/const/config";
import { MinAmount } from "@/codegen/ts-codegen/AuctionsManager.types";
import { AuctionsManagerQueryClient } from "@/codegen/ts-codegen/AuctionsManager.client";

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
