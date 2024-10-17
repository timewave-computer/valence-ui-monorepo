"use server";
import { z } from "zod";

const OSMOSIS_API_URL = "https://lcd.osmosis.zone";

/***
 * THIS IS A WIP, NEED TO CONVERT DENOMS TO OSMO
 */

export const fetchOsmosisRate = async () => {
  const res = await fetch(
    OSMOSIS_API_URL + "/osmosis/poolmanager/v1beta1/all-pools",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data " + res.status + "" + res.statusText);
  }

  const data = await res.json();
  const parsedData = PoolsResponseSchema.parse(data);

  const poolId = parsedData.pools.filter((p) => {
    if (!p.pool_assets) return false;

    const [tokenA, tokenB] = p.pool_assets;
    return tokenA.token.denom === "untrn";
  });
  return parsedData;
};

// Define the Token schema
const TokenSchema = z.object({
  denom: z.string(),
  amount: z.string(),
});

// Define the Pool Asset schema
const PoolAssetSchema = z.object({
  token: TokenSchema,
  weight: z.string(),
});

// Define the Pool schema
const PoolSchema = z.object({
  address: z.string().optional(),
  id: z.string().optional(),
  pool_assets: z.array(PoolAssetSchema).optional(),
});

// Define the Pools schema
const PoolsResponseSchema = z.object({
  pools: z.array(PoolSchema),
});
