"use server";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { OriginAssetResponse, OriginAssetResponseSchema } from "@/types/ibc";

const SKIP_URL = "https://api.skip.money";

export const fetchOriginAssets = async (
  assets: Array<{ denom: string; chain_id: string }>,
): Promise<OriginAssetResponse["origin_assets"]> => {
  const res = await fetch(SKIP_URL + "/v1/fungible/ibc_origin_assets", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assets: assets,
    }),
  });

  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.IBC_TRACE_FAIL}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();

  if (process.env.NEXT_PUBLIC_CHAIN_ID === "pion-1") {
    // patch for test assets
    for (let i = 0; i < result.origin_assets.length; i++) {
      if (
        result.origin_assets[i].asset.denom ===
        "factory/neutron1phx0sz708k3t6xdnyc98hgkyhra4tp44et5s68/rebalancer-test"
      ) {
        result.origin_assets[i].asset.decimals = 6;
        result.origin_assets[i].asset.symbol = "USDC";
        result.origin_assets[i].asset.recommended_symbol = "USDC";
        result.origin_assets[i].asset.coingecko_id = "usd-coin";
        result.origin_assets[i].asset.name = "USDC";
      } else if (result.origin_assets[i].asset.denom === "untrn") {
        result.origin_assets[i].asset.coingecko_id = "neutron-3";
      }
    }
  }
  const validated = OriginAssetResponseSchema.safeParse(result);
  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.IBC_TRACE_FAIL},  Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }
  return validated.data.origin_assets;
};
