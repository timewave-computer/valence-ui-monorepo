import { USDC_DENOM } from "@/const/usdc";
import { subDays } from "date-fns";

const INDEXER_API_KEY = process.env.INDEXER_API_KEY;
if (!INDEXER_API_KEY) throw new Error("INDEXER_API_KEY is not set");
const ORACLE_ADDRESS =
  "neutron1s8uqyh0mmh8g66s2dectf56c08y6fvusp39undp8kf4v678ededsy6tstf";
const INDEXER_URL = "https://neutron-mainnet.indexer.daodao.zone";

const timeStep = 24 * 60 * 60 * 1000; // 1 day (in milliseconds)

const getRange = (startDate: Date, dayRange: number) => {
  startDate.setHours(0, 0, 0, 0);
  const oneYearAgo = subDays(startDate, dayRange);
  const start = oneYearAgo.getTime();
  const end = startDate.getTime();
  const range = `${start}..${end}`;
  return range;
};

export class IndexerUrl {
  static accountConfig(address: string) {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${address}/valence/account/rebalancerConfig`;
  }
  static fundsInAuction(address: string) {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${address}/valence/account/fundsInAuction`;
  }
  static historicalBalances(
    address: string,
    {
      startDate,
      dayRange,
    }: {
      startDate: Date;
      dayRange: number;
    },
  ) {
    const range = getRange(startDate, dayRange);
    return `${INDEXER_URL}/${INDEXER_API_KEY}/wallet/${address}/bank/balances?times=${range}&timeStep=${timeStep}`;
  }
  // by default composes prices in USDC_DENOM
  static historicalPrices(
    denom: string,
    {
      baseDenom = USDC_DENOM,
      startDate,
      dayRange,
    }: {
      baseDenom?: string;
      startDate: Date;
      dayRange: number;
    },
  ) {
    const range = getRange(startDate, dayRange);
    const pair = `${denom},${baseDenom}`; // pair: “untrn,ibc/ABC”
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${ORACLE_ADDRESS}/valence/oracle/price?pair=${pair}&times=${range}&timeStep=${timeStep}`;
  }
}
