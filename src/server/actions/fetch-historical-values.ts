"use server";

import {
  ntrnPrices,
  usdcPrices,
  osmoPrices,
  atomPrices,
} from "@/const/mock-data";

export async function fetchHistoricalValues({
  address,
  startDate,
  endDate,
  baseDenom,
  targetDenoms,
}: {
  baseDenom: string;
  targetDenoms: string[];
  address: string;
  startDate: Date;
  endDate: Date;
}): Promise<FetchHistoricalValuesReturnValue> {
  /***
   * TODO:
   * 1. fetch historical balances from indexer /historical-balances [dateRange=1year]  [address=address]
   * 2. for each denom, fetch historical prices from indexer /oracle/prices [denom=denom] [baseDenom=baseDenom]
   * 3. compute values & return
   */

  return Promise.resolve({
    baseDenom: "uusdc",
    values: generateHistoricValues(),
  });
}

export type FetchHistoricalValuesReturnValue = {
  baseDenom: string;
  values: Array<{
    timestamp: number;
    tokens: Array<{
      denom: string;
      price: number;
      amount: number;
    }>;
  }>;
};

const generateHistoricValues = () => {
  // start with todays date
  // create array for 365 days, access element[i]

  const vals = [];

  for (let i = 0; i < 365; i++) {
    // last 10 months
    const date = new Date();
    date.setDate(date.getDate() - i); // Subtract i days from current date

    // Get timestamp for the current date at 00:00:00 (midnight)
    const timestamp = date.setHours(0, 0, 0, 0);

    // TODO: do this by target input and not hardcoded
    vals.push({
      timestamp: timestamp,
      tokens: [
        {
          denom: "untrn",
          price: ntrnPrices[i].close,
          amount: 569537,
        },
        {
          denom: "uusdc",
          price: usdcPrices[i].close,
          amount: 128471,
        },

        { denom: "uatom", price: atomPrices[i].close, amount: 4393 },
        {
          denom: "uosmo",
          price: osmoPrices[i].close,
          amount: 83222,
        },
      ],
    });
  }
  return vals.sort((a, b) => a.timestamp - b.timestamp);
};
