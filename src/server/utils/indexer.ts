import { USDC_DENOM } from "@/const/chain-data";
import { chainConfig } from "@/const/config";

const INDEXER_API_KEY = process.env.INDEXER_API_KEY;
if (!INDEXER_API_KEY) throw new Error("INDEXER_API_KEY is not set");
const ORACLE_ADDRESS = chainConfig.addresses.oracle;
const INDEXER_URL = chainConfig.indexerUrl;
const timeStep = 24 * 60 * 60 * 1000; // 1 day (in milliseconds)

const getRange = (startDate: Date, endDate: Date) => {
  const range = `${startDate.getTime()}..${endDate.getTime()}`;
  return range;
};

export class IndexerUrl {
  static accounts(walletAddress: string) {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/wallet/${walletAddress}/valence/accounts`;
  }
  static accountAdmin(valenceAddress: string) {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${valenceAddress}/valence/account/admin`;
  }
  static accountConfig(valenceAddress: string) {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${valenceAddress}/valence/account/rebalancerConfig`;
  }
  static fundsInAuction = (valenceAddress: string) => {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${valenceAddress}/valence/account/fundsInAuction`;
  };
  static historicalTargets = (
    valenceAddress: string,
    { startDate, endDate }: { startDate: Date; endDate: Date },
  ) => {
    const range = getRange(startDate, endDate);
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${valenceAddress}/valence/account/rebalancerTargets?times=${range}&timeStep=${timeStep}`;
  };

  static historicalBalances = (
    valenceAddress: string,
    {
      startDate,
      endDate,
    }: {
      startDate: Date;
      endDate: Date;
    },
  ) => {
    const range = getRange(startDate, endDate);
    return `${INDEXER_URL}/${INDEXER_API_KEY}/wallet/${valenceAddress}/bank/balances?times=${range}&timeStep=${timeStep}`;
  };

  static historicOraclePrices = (
    denom: string,
    {
      baseDenom = USDC_DENOM,
      startDate,
      endDate,
    }: {
      baseDenom?: string;
      startDate: Date;
      endDate: Date;
    },
  ) => {
    const range = getRange(startDate, endDate);
    const pair = `${denom},${baseDenom}`; // pair: “untrn,ibc/ABC”
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${ORACLE_ADDRESS}/valence/oracle/price?pair=${pair}&times=${range}&timeStep=${timeStep}`;
  };
}
