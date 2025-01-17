"use server";
import { mockRegistry } from "@/mock-data";
import {
  ProgramParser,
  fetchAccountBalances,
  QueryConfig,
  ProgramParserResult,
  QueryConfigManager,
} from "@/app/programs/server";
import { getDefaultMainChainConfig } from "@/app/programs/server";

type GetProgramDataProps = {
  programId: string;
  queryConfig?: QueryConfig;
};
// TODO: make a generic wrapper with input props and success return value is auto derived
export const getProgramData = async (
  props: GetProgramDataProps & {
    throwError?: boolean;
  },
) => {
  const { throwError, ...restOfProps } = props;
  try {
    return await _getProgramData(restOfProps);
  } catch (e) {
    // nextjs obscures the error message from failed server actions, so this is a rudimentary solution to get proper error messages in the client
    if (throwError) throw e;
    return {
      code: 400,
      message: "Could not fetch program",
      error: e.message + " " + JSON.stringify(e),
    };
  }
};

export type GetProgramDataReturnValue = Awaited<
  ReturnType<typeof _getProgramData>
>;

// defined separetely to isolate the return type
const _getProgramData = async ({
  programId,
  queryConfig: userSuppliedQueryConfig,
}: GetProgramDataProps) => {
  let queryConfigManager = new QueryConfigManager(
    userSuppliedQueryConfig ?? {
      main: getDefaultMainChainConfig(),
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

  // const { edges, nodes } = NodeComposer.generate({
  //   program: {
  //     accounts,
  //     libraries,
  //     links,
  //   },
  //   accountBalances: balances,
  // });

  return {
    queryConfig: completeQueryConfig,
    balances,
    ...program,
  };
};

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
      (chain) => chain.name === account.chainName,
    )?.rpc;
    if (!rpcUrl) {
      throw new Error(`No RPC URL found for chain ID ${account.chainName}`);
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
