"use server";
import { OriginAsset } from "@/types/ibc";
import { fetchOriginAssets } from "@/server/actions";

export type FetchMetadataResponse = Record<string, OriginAsset>;

export const fetchAssetMetadata = async (
  chainList: Array<{
    chainId: string;
    denoms: string[];
  }>,
) => {
  const promises = chainList.map(async (query) => {
    return fetchMetadata(query);
  });
  const results = await Promise.allSettled(promises);
  // return key value obj, denom is key, metadata is value. to be used in cache

  const successfulResults = results
    .filter((result) => result.status === "fulfilled")
    .map(
      (result) =>
        (result as PromiseFulfilledResult<FetchMetadataResponse>).value,
    );

  return combineDicts(successfulResults);
};

const fetchMetadata = async ({
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

function combineDicts<T>(arrayOfDicts: Record<string, T>[]): Record<string, T> {
  return arrayOfDicts.reduce((acc, dict) => {
    return { ...acc, ...dict };
  }, {});
}
