import { SupportedChainId, SupportedAsset } from "@/const/config";

/***
 * mainnet
 */
export const USDC_DENOM =
  "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81";
export const NTRN_DENOM = "untrn";

export const supportedAssets: Record<
  SupportedChainId,
  Array<SupportedAsset>
> = {
  /**
   * NOTE: ORDER MATTERS. This determines the color of assets in the graph
   */
  "neutron-1": [
    { symbol: "NTRN", denom: NTRN_DENOM, coingeckoId: "neutron-3" },
    { symbol: "USDC", denom: USDC_DENOM, coingeckoId: "usd-coin" },
    {
      symbol: "ATOM",
      denom:
        "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
      coingeckoId: "cosmos",
    },
    {
      symbol: "NEWT",
      denom: "factory/neutron1p8d89wvxyjcnawmgw72klknr3lg9gwwl6ypxda/newt",
      coingeckoId: "newt",
    },
    {
      symbol: "stATOM",
      denom:
        "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
      coingeckoId: "stride-staked-atom",
    },
    {
      symbol: "dATOM",
      denom:
        "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
      coingeckoId: "drop-staked-atom",
    },
  ],
  "pion-1": [
    { symbol: "NTRN", denom: NTRN_DENOM, coingeckoId: "neutron-3" },
    {
      symbol: "TEST_ASSET",
      coingeckoId: "usd-coin",
      denom:
        "factory/neutron1phx0sz708k3t6xdnyc98hgkyhra4tp44et5s68/rebalancer-test",
    },
  ],
};
