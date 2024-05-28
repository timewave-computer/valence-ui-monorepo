const INDEXER_API_KEY = process.env.INDEXER_API_KEY;
if (!INDEXER_API_KEY) throw new Error("INDEXER_API_KEY is not set");

const INDEXER_URL = "https://neutron-mainnet.indexer.daodao.zone";

export class IndexerUrl {
  static accountConfig(address: string) {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${address}/valence/account/rebalancerConfig`;
  }
  static fundsInAuction(address: string) {
    return `${INDEXER_URL}/${INDEXER_API_KEY}/contract/${address}/valence/account/fundsInAuction`;
  }
}

export * from "./rebalancer-config";
export * from "./funds-in-auction";
