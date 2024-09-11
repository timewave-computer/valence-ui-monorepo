"use server";
import { Coin } from "@cosmjs/stargate";
import { IndexerUrl } from "@/server/utils";
import { ErrorHandler, ERROR_MESSAGES } from "@/const/error";
import { IndexerFundsInAuctionSchema } from "@/types/rebalancer";

export async function fetchAuctionBalances({
  address,
}: {
  address: string;
}): Promise<Coin[]> {
  const auctionBalancesResponse = await getAuctionBalances(address);
  const auctionBalances = Object.keys(auctionBalancesResponse).map((denom) => {
    return {
      denom,
      amount: auctionBalancesResponse[denom].toString(),
    };
  });

  return auctionBalances;
}

const getAuctionBalances = async (
  address: string,
): Promise<Record<string, number>> => {
  const res = await fetch(IndexerUrl.fundsInAuction(address), {
    next: {
      revalidate: 1, // 1 minute
    },
  });
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_FUNDS_IN_AUCTION_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  if (!res.body) {
    // this is considered as 'no funds in auction', return empty
    return {};
  }
  const data = await res.json();
  const balances = IndexerFundsInAuctionSchema.parse(data);
  const result: Record<string, number> = {};
  balances.forEach((balance) => {
    const denom = balance.pair[0];
    const amount = parseFloat(balance.amount);
    result[denom] = amount;
  });
  return result;
};
