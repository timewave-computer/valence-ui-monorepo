/***
 * https://docs.coingecko.com/v3.0.1/reference/simple-price
 */
import { z } from "zod";

export const CoingeckoPriceSchema = z.object({
  usd: z.number(), // we are only requesting USD for now. this should become generic if other currencies needed
  last_updated_at: z.number(),
});

export const CoingeckoSimplePriceResponseSchema = z.record(
  z.string(),
  CoingeckoPriceSchema,
);

export type CoingeckoSimplePriceResponse = z.infer<
  typeof CoingeckoSimplePriceResponseSchema
>;
export type CoingeckoPrice = z.infer<typeof CoingeckoPriceSchema>;
