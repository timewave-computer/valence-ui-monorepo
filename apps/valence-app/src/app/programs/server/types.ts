import { Coin } from "@cosmjs/stargate";

export type AccountBalances = Array<{
  address: string;
  balances: readonly Coin[];
}>;
