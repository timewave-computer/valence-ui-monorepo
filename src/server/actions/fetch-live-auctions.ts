"use server";

import { getCosmwasmClient, getStargateClient } from "@/server/utils";
import { chainConfig } from "@/const/config";
import { AuctionsManagerQueryClient } from "@/codegen/ts-codegen/AuctionsManager.client";
import {
  ActiveAuction,
  ActiveAuctionStatus,
  Addr,
  GetPriceResponse,
  Uint128,
} from "@/codegen/ts-codegen/Auction.types";

export async function fetchLiveAuctions() {
  // get auction addresses
  // fetch data for each one
  const stargateClient = await getStargateClient();
  const cwClient = await getCosmwasmClient();

  const auctionsManagerClient = new AuctionsManagerQueryClient(
    cwClient,
    chainConfig.addresses.auctionsManager,
  );

  const [currentBlock, auctions] = await Promise.all([
    stargateClient.getHeight(),
    auctionsManagerClient.getPairs({
      limit: 100,
    }),
  ]);

  const getAuctionRequests = auctions.map(async (pairAndAddr) => {
    const [pairTuple, auctionAddress] = pairAndAddr;
    const auctionPromise = cwClient.queryContractSmart(
      auctionAddress,
      "get_auction",
    ) as Promise<ActiveAuction>;

    // this ensures we await the nested promises in Promise.all
    return auctionPromise.then((auction) => {
      // handles case where response can be { auction_closed: [] }
      let sanitizedStatus =
        typeof auction.status === "string" ? auction.status : "closed";

      //  status not 100% reliable. check if end block passed, or amount = 0.
      if (parseFloat(auction.available_amount) === 0)
        sanitizedStatus = "finished";
      if (auction.end_block < currentBlock) sanitizedStatus = "closed";

      return {
        pair: pairTuple,
        address: auctionAddress,
        auction: {
          ...auction,
          status: sanitizedStatus as SanitizedAuctionStatus,
        },
      };
    });
  });

  const getPriceRequests = auctions.map(async (pairAndAddr) => {
    const [pairTuple, auctionAddress] = pairAndAddr;

    const pricePromise = cwClient.queryContractSmart(
      auctionAddress,
      "get_price",
    ) as Promise<GetPriceResponse>;

    // this ensures we await the nested promises in Promise.all
    return pricePromise
      .then((priceResponse) => {
        return {
          pair: pairTuple,
          address: auctionAddress,
          price: parseFloat(priceResponse.price),
        };
      })
      .catch((e) => {
        // throws error if auction is closed, handle silently
        return { pair: pairTuple, address: auctionAddress, price: null };
      });
  });

  return {
    currentBlock,
    auctions: await Promise.all(getAuctionRequests),
    prices: await Promise.all(getPriceRequests),
  };
}

type FunctionReturnType = ReturnType<typeof fetchLiveAuctions>;
type SanitizedAuctionStatus = Exclude<
  ActiveAuctionStatus | "closed",
  { close_auction: [Addr | null, Uint128, Uint128] } | "auction_closed"
>;

export type FetchLiveAuctionsReturnType = Awaited<FunctionReturnType>;
export type LiveAuctionStatus = SanitizedAuctionStatus;
