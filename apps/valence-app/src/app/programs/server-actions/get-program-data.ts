"use server";
import { mockRegistry } from "@/mock-data";
import {
  ProgramParser,
  fetchAccountBalances,
  NodeComposer,
  QueryConfig,
  ProgramParserResult,
  defaultMainChainConfig,
  QueryConfigManager,
} from "@/app/programs/server";

export const getProgramData = async ({
  programId,
  queryConfig: userSuppliedQueryConfig,
}: {
  programId: string;
  queryConfig?: QueryConfig;
}) => {
  try {
    let queryConfigManager = new QueryConfigManager(
      userSuppliedQueryConfig ?? {
        main: defaultMainChainConfig,
        allChains: undefined, // need to construct this from accounts
      },
    );

    // must default registry address and mainchain RPC if no config given
    const rawProgram = await fetchProgram({
      programId,
      config: queryConfigManager.getMainChainConfig(),
    });

    const program = ProgramParser.extractData(rawProgram);

    const { accounts, links, libraries } = program;

    queryConfigManager.setAllChainsConfigIfEmpty(accounts);
    const completeQueryConfig = queryConfigManager.getQueryConfig();

    const balances = await queryAccountBalances(accounts, completeQueryConfig);

    const { edges, nodes } = NodeComposer.generate({
      program: {
        accounts,
        libraries,
        links,
      },
      accountBalances: balances,
    });

    return {
      nodes,
      edges,
      queryConfig: completeQueryConfig,
      ...program,
    };
  } catch (e) {
    return {
      code: 400,
      message: "Could not fetch program",
      error: e.message + " " + JSON.stringify(e),
    };
  }
};

export type GetProgramDataReturnValue = Awaited<
  ReturnType<typeof getProgramData>
>;

const fetchProgram = async ({
  programId,
  config,
}: {
  programId: string;
  config: QueryConfig["main"];
}) => {
  if (!(programId in mockRegistry))
    throw new Error(`Program ${programId} not found in registry`);
  return Promise.resolve(mockRegistry[programId]);
};

const queryAccountBalances = async (
  accounts: ProgramParserResult["accounts"],
  config: QueryConfig,
) => {
  const requests = Object.entries(accounts).map(async ([id, account]) => {
    if (!account.addr) {
      // should not happen, just to make typescript happy
      throw new Error(`Account ${id} does not have an address`);
    }

    const rpcUrl = config.allChains.find(
      (rpc) => rpc.chainId === account.chainId,
    )?.rpc;
    if (!rpcUrl) {
      throw new Error(`No RPC URL found for chain ID ${account.chainId}`);
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
