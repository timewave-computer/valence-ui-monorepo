"use server";

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

  return Promise.resolve(HISTORICAL_VALUES);
}

export type FetchHistoricalValuesReturnValue = {
  baseDenom: string;
  values: {
    [denom: string]: [
      {
        time: number;
        amount: number;
        price: number;
        value: number;
      },
    ];
  };
};

const HISTORICAL_VALUES: FetchHistoricalValuesReturnValue = {
  baseDenom: "uusdc",
  values: {
    untrn: [
      {
        time: 1687910400,
        amount: 569537,
        price: 0.733591,
        value: 0.733591 * 569537,
      },
    ],
    uusdc: [
      {
        time: 1687910400,
        amount: 428471,
        price: 1.0,
        value: 428471,
      },
    ],
    uuatom: [
      {
        time: 1687910400,
        amount: 428471,
        price: 8.323232,
        value: 428471 * 8.323232,
      },
    ],
    uuosmo: [
      {
        time: 1687910400,
        amount: 662817,
        price: 0.8323232,
        value: 662817 * 0.8323232,
      },
    ],
  },
};
