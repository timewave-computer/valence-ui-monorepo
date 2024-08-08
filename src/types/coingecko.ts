import { z } from "zod";

export const CoinGeckoHistoricPriceSchema = z.tuple([z.number(), z.number()]); // [timestamp, price]
export type CoinGeckoHistoricPrice = z.infer<
  typeof CoinGeckoHistoricPriceSchema
>;

export const CoinGeckoHistoricPricesSchema = z.array(
  CoinGeckoHistoricPriceSchema,
);

export type CoinGeckoHistoricPrices = z.infer<
  typeof CoinGeckoHistoricPricesSchema
>;
