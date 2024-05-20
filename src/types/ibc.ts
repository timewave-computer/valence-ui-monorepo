/***
 * from
 * https://api-swagger.skip.money/#/Fungible/getOriginAssets
 * API
 */
import { z } from "zod";

export const OriginAssetSchema = z.object({
  asset: z.object({
    denom: z.string(),
    chain_id: z.string(),
    origin_denom: z.string(),
    origin_chain_id: z.string(),
    trace: z.string(),
    is_cw20: z.boolean(),
    is_evm: z.boolean(),
    is_svm: z.boolean(),
    coingecko_id: z.string().nullable().optional(),
    decimals: z.number().nullable().optional(),
    description: z.string().nullable().optional(),
    logo_uri: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    symbol: z.string().nullable().optional(),
    recommended_symbol: z.string().nullable().optional(),
  }),
});

export const OriginAssetResponseSchema = z.object({
  origin_assets: z.array(OriginAssetSchema),
});
export type OriginAssetResponse = z.infer<typeof OriginAssetResponseSchema>;

export type OriginAsset = z.infer<typeof OriginAssetSchema>;
