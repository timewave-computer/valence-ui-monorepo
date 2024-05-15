"use server";

import {
  ntrnPrices,
  usdcPrices,
  osmoPrices,
  atomPrices,
} from "@/const/mock-data";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";

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
    values: generateHistoricValues(startDate),
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

const generateHistoricValues = (startDate: Date) => {
  const vals = [];
  for (let i = 0; i < 365; i++) {
    let date = new UTCDate(startDate);
    date = subDays(date, i);
    date.setHours(0, 0, 0, 0);
    const timestamp = date.getTime();

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
