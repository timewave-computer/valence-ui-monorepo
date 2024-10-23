import { NEUTRON_CHAIN } from "@/const/chain-data/neutron";
import { assets } from "chain-registry";
import { NEUTRON_TESTNET_CHAIN } from "@/const/chain-data/neutrontestnet";
import { AssetList, Chain } from "@chain-registry/types";
import { supportedAssets, USDC_DENOM } from "@/const/chain-data";
import { getFeaturedAccounts } from "@/const/config/featured";

export type CodeIdsType = {
  ServicesManager: number;
  Rebalancer: number;
  AuctionsManager: number;
  Auction: number;
  Oracle: number;
  Account: number;
};
export type SupportedAsset = {
  denom: string;
  symbol: string;
  coingeckoId: string;
};
const SUPPORTED_CHAIN_IDS = ["neutron-1", "pion-1"];
export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number];
export type FeaturedAccount = {
  label: string;
  value: string;
};
type SupportedChainConfig = {
  chain: Chain;
  assets: AssetList[];
  codeIds: CodeIdsType;
  supportedAssets: SupportedAsset[];
  indexerUrl: string;
  addresses: {
    rebalancer: string;
    oracle: string;
    servicesManager: string;
    auctionsManager: string;
  };
  defaultBaseTokenDenom: string;
  featuredAccounts: FeaturedAccount[];
  serviceFee: {
    denom: string;
    amount: number;
    symbol: string;
    decimalPoints: number;
  };
  celatoneUrl: string;
  mintscanUrl: string;
  estBlockTime: number; // seconds
};

const isSupportedChainId = (id: string): id is SupportedChainId =>
  SUPPORTED_CHAIN_IDS.includes(id);

export const getChainId = () => {
  const id = process.env.NEXT_PUBLIC_CHAIN_ID || "neutron-1";
  return isSupportedChainId(id) ? id : NEUTRON_CHAIN.chain_id;
};

const SupportedChainConfig: Record<SupportedChainId, SupportedChainConfig> = {
  "neutron-1": {
    chain: NEUTRON_CHAIN,
    assets: assets.filter((a) => a.chain_name === NEUTRON_CHAIN.chain_name),
    codeIds: {
      ServicesManager: 1615,
      Rebalancer: 1616,
      AuctionsManager: 1614,
      Auction: 1617,
      Oracle: 1619,
      Account: 1618,
    },
    supportedAssets: supportedAssets["neutron-1"],
    indexerUrl: "https://neutron-mainnet.indexer.daodao.zone",
    addresses: {
      rebalancer:
        "neutron1qs6mzpmcw3dvg5l8nyywetcj326scszdj7v4pfk55xwshd4prqnqfwc0z2",
      oracle:
        "neutron1s8uqyh0mmh8g66s2dectf56c08y6fvusp39undp8kf4v678ededsy6tstf",
      servicesManager:
        "neutron1gantvpnat0la8kkkzrnj48d5d8wxdjllh5r2w4r2hcrpwy00s69quypupa",
      auctionsManager:
        "neutron13exc5wdc7y5qpqazc34djnu934lqvfw2dru30j52ahhjep6jzx8ssjxcyz",
    },
    featuredAccounts: getFeaturedAccounts("neutron-1", process.env.NODE_ENV),
    defaultBaseTokenDenom: USDC_DENOM,
    serviceFee: {
      denom: "untrn",
      amount: 1,
      symbol: "NTRN",
      decimalPoints: 6,
    },
    celatoneUrl: "https://neutron.celat.one/neutron-1",
    mintscanUrl: "https://www.mintscan.io/neutron",
    estBlockTime: 2.42,
  },
  "pion-1": {
    chain: NEUTRON_TESTNET_CHAIN,
    assets: assets.filter(
      (a) => a.chain_name === NEUTRON_TESTNET_CHAIN.chain_name,
    ),
    codeIds: {
      ServicesManager: 5674,
      Rebalancer: 5675,
      AuctionsManager: 5673,
      Auction: 5679,
      Oracle: 5676,
      Account: 5677,
    },
    supportedAssets: supportedAssets["pion-1"],
    indexerUrl: "https://neutron-testnet.indexer.daodao.zone",
    addresses: {
      rebalancer:
        "neutron1y9aurkegmqlqwhsnwctee4w4aja7n64yuat800p8yys509pyl0fsvrmydm",
      oracle:
        "neutron1g4qcmk65nw57hmqlzk6cejnftg20zmctky0l2epdfz3npw3x2cmqprul6f",
      servicesManager:
        "neutron13ncggwefau3xla04vlugy20meap7g7a9lf2d2sxwgwvgr9mnn3yqkpjzs6",
      auctionsManager:
        "neutron13exc5wdc7y5qpqazc34djnu934lqvfw2dru30j52ahhjep6jzx8ssjxcyz",
    },
    featuredAccounts: getFeaturedAccounts("pion-1", process.env.NODE_ENV),
    defaultBaseTokenDenom: "untrn",
    serviceFee: {
      symbol: "NTRN",
      denom: "untrn",
      amount: 0.001,
      decimalPoints: 6,
    },
    celatoneUrl: "https://neutron.celat.one/pion-1",
    mintscanUrl: "https://www.mintscan.io/neutron",
    estBlockTime: 2.42,
  },
};

let CHAIN_ID: SupportedChainId = getChainId();
const config = SupportedChainConfig[CHAIN_ID];

export { config as chainConfig };
