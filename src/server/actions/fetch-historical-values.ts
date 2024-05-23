"use server";

import { ntrnPrices, usdcPrices } from "@/const/mock-data";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import { AccountTarget } from "@/server/actions/fetch-valence-account-config";

export async function fetchHistoricalValues({
  address,
  startDate,
  endDate,
  baseDenom,
  targets,
}: {
  baseDenom: string;
  targets: Array<AccountTarget>;
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
      decimals: number;
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
          amount: 1229473994,
          decimals: 6,
        },
        {
          denom:
            "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
          price: usdcPrices[i].close,
          amount: 2031277390,
          decimals: 6,
        },
      ],
    });
  }
  return vals.sort((a, b) => a.timestamp - b.timestamp);
};
