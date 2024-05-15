"use server";

export async function fetchLivePortfolio({
  address,
  baseDenom,
}: {
  address: string;
  baseDenom: string;
}): Promise<FetchLivePortfolioReturnValue> {
  /***
   * TODO:
   * 1. fetch live balances on valence account (cosmjs)
   * 2. fetch amounts on auction from indexer /auction/account [date=today] [address=address]
   * 4. fetch prices from CoinGecko
   * 3. combine balances, compute value + distribution
   */

  return Promise.resolve(LIVE_PORTFOLIO);
}

export type FetchLivePortfolioReturnValue = {
  baseDenom: string;
  portfolio: {
    [denom: string]: {
      metadata: {
        denom: string;
        symbol: string;
        name: string;
      };
      amount: number;
      price: number;
    };
  };
};

const LIVE_PORTFOLIO: FetchLivePortfolioReturnValue = {
  baseDenom: "uusdc",
  portfolio: {
    untrn: {
      metadata: {
        denom: "untrn",
        symbol: "NTRN",
        name: "Neutron",
      },
      amount: 569537,
      price: 0.733591,
    },
    uusdc: {
      metadata: {
        denom: "uusdc",
        symbol: "USDC",
        name: "USDC",
      },
      amount: 428471,
      price: 1.000002,
    },
    uatom: {
      metadata: {
        denom: "uatom",
        symbol: "ATOM",
        name: "Atom",
      },
      amount: 428471,
      price: 1.000002,
    },
    uosmo: {
      metadata: {
        denom: "uosmo",
        symbol: "OSMO",
        name: "Osmosis",
      },
      amount: 662817,
      price: 0.8332321,
    },
  },
};
