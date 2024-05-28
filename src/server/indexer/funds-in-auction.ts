import { z } from "zod";

import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { IndexerUrl } from "@/server/indexer";

export const fetchFundsInAuction = async (
  address: string,
): Promise<IndexerFundsInAuctionResponse> => {
  const res = await fetch(IndexerUrl.fundsInAuction(address));
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_FUNDS_IN_AUCTION_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();
  return Promise.resolve(IndexerFundsInAuctionSchema.parse(result));
};

const IndexerFundsInAuctionSchema = z.array(
  z.object({
    pair: z.tuple([z.string(), z.string()]),
    amount: z.string(),
  }),
);

export type IndexerFundsInAuctionResponse = z.infer<
  typeof IndexerFundsInAuctionSchema
>;
