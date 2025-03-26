import {
  fetchAccountBalances,
  getDomainConfig,
  ProgramParserResult,
  ProgramQueryConfig,
} from "@/app/programs/server";

export const queryAccountBalances = async (
  accounts: ProgramParserResult["accounts"],
  config: ProgramQueryConfig,
) => {
  const requests = Object.entries(accounts).map(async ([id, account]) => {
    if (!account.addr) {
      // should not happen, just to make typescript happy
      throw new Error(`Account ${id} does not have an address`);
    }

    const rpcUrl = getDomainConfig({
      queryConfig: config,
      domainName: account.domainName,
    })?.rpc;

    if (!rpcUrl) {
      throw new Error(
        `No RPC URL found for domain ${account.domainName}. Check RPC settings.`,
      );
    }
    const balances = await fetchAccountBalances({
      accountAddress: account.addr,
      rpcUrl,
    });
    return {
      address: account.addr,
      balances,
    };
  });

  return Promise.all(requests);
};

export type AccountBalancesReturnValue = Awaited<
  ReturnType<typeof queryAccountBalances>
>;
