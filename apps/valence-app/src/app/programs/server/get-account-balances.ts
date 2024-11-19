import { getStargateClient } from "@/server/utils";
import { Coin } from "@cosmjs/stargate";

export type GetAccountBalancesInput = Array<{
  chainId: string;
  accountAddress: string;
  rpcUrl: string;
}>;
export const getAccountBalances = async (
  args: GetAccountBalancesInput,
): Promise<
  Array<{
    address: string;
    balances: Promise<readonly Coin[]>;
  }>
> => {
  // TODO: move the rpc into here for now
  const bals = args.map(async (arg) => {
    const stargateClient = await getStargateClient(arg.rpcUrl);
    return {
      address: arg.accountAddress,
      balances: stargateClient.getAllBalances(arg.accountAddress),
    };
  });

  return Promise.all(bals);
};
