/***
 * Constant to define what shows up as featured in production
 */

import { FeaturedAccount, SupportedChainId } from "@/const/config";

const PROD_FEATURED_ACCOUNTS: FeaturedAccount[] = [
  {
    label: "Timewave Devs",
    value: "neutron13pvwjc3ctlv53u9c543h6la8e2cupkwcahe5ujccdc4nwfgann7ss0xynz",
  },
];

const TESTNET_FEATURED_ACCOUNTS: FeaturedAccount[] = [];

// configuration for featured accounts for environment and chain
const featuredAccounts: Record<
  SupportedChainId,
  Record<"production" | "development", FeaturedAccount[]>
> = {
  "neutron-1": {
    production: PROD_FEATURED_ACCOUNTS,
    development: [
      ...PROD_FEATURED_ACCOUNTS,
      {
        label: "(dev) Lena's Highly Productive DAO",
        value:
          "neutron1vw0zuapgkpnq49ffyvkt4s4chy9lnf78s2ezuwwvd95lq065fpes277xkt",
      },
      {
        label: "(dev) NEWT USDC Test",
        value:
          "neutron19nd99fe02ktl8fz32mhqnpq7fgnejdccjv24ejr68gl5ed3d472qypzqnf",
      },
    ],
  },
  "pion-1": {
    production: TESTNET_FEATURED_ACCOUNTS,
    development: TESTNET_FEATURED_ACCOUNTS,
  },
};

export const getFeaturedAccounts = (
  chainId: SupportedChainId,
  env: "production" | "test" | "development",
) => {
  const environment =
    process.env.NODE_ENV === "production" ? "production" : "development";
  return featuredAccounts[chainId][environment];
};
