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
    { symbol: "NTRN", denom: NTRN_DENOM },
    { symbol: "USDC", denom: USDC_DENOM },
    {
      symbol: "ATOM",
      denom:
        "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
    },
    {
      symbol: "NEWT",
      denom: "factory/neutron1p8d89wvxyjcnawmgw72klknr3lg9gwwl6ypxda/newt",
    },
  ],
  "pion-1": [
    { symbol: "NTRN", denom: NTRN_DENOM },
    {
      symbol: "TEST_ASSET",
      denom:
        "factory/neutron1phx0sz708k3t6xdnyc98hgkyhra4tp44et5s68/rebalancer-test",
    },
  ],
};
