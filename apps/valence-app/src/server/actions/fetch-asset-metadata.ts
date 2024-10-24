"use server";
import { OriginAsset } from "@/types/ibc";
import { fetchOriginAssets } from ".";

export type FetchMetadataResponse = Record<string, OriginAsset>;

export const fetchAssetMetadata = async ({
  denoms,
  chainId,
}: {
  denoms: string[];
  chainId: string;
}): Promise<FetchMetadataResponse> => {
  // will error if any fetches fail
  const originAssets = await fetchOriginAssets(
    denoms.map((denom) => ({ denom, chain_id: chainId })),
  );
  const metadata: FetchMetadataResponse = {};

  denoms.forEach((denom, index) => {
    metadata[denom] = originAssets[index].asset;
  });
  return metadata;
};
