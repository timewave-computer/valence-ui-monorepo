import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { OriginAssetResponse, OriginAssetResponseSchema } from "@/types/ibc";

const SKIP_URL = "https://api.skip.money";

export const getOriginAssets = async (
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
  const validated = OriginAssetResponseSchema.safeParse(result);
  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.IBC_TRACE_FAIL},  Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }
  return validated.data.origin_assets;
};
