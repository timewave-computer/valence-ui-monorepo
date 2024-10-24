"use server";
import { IndexerUrl } from "@/server/utils";
import { ErrorHandler, ERROR_MESSAGES } from "@/const/error";
import {
  IndexerAuction,
  IndexerFundsInAuctionSchema,
} from "@/types/rebalancer";
import { minutesToSeconds } from "date-fns";

export type FetchAuctionBalances = {
  amounts: Array<IndexerAuction>;
};

export async function fetchAuctionBalances({
  address,
}: {
  address: string;
}): Promise<FetchAuctionBalances> {
  let result: Array<IndexerAuction> = [];
  const res = await fetch(IndexerUrl.fundsInAuction(address), {
    next: {
      revalidate: minutesToSeconds(1),
    },
  });
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_FUNDS_IN_AUCTION_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }

  // if no body, this is considered as 'no funds in auction', return empty
  if (res.body) {
    const data = await res.json();
    result = IndexerFundsInAuctionSchema.parse(data);
  }

  return { amounts: result };
}
