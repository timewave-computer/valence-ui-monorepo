"use server";
import { mockRegistry } from "@/mock-data";
import {
  ProgramParser,
  fetchAccountBalances,
  type QueryConfig,
  QueryConfigManager,
  type ProgramParserResult,
  type NormalizedAccounts,
  type NormalizedLibraries,
  type FetchLibrarySchemaReturnValue,
} from "@/app/programs/server";
import {
  getDefaultMainChainConfig,
  fetchLibrarySchema,
} from "@/app/programs/server";
import { fetchAssetMetadata } from "@/server/actions";

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
      message: "Error fetching program",
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
  const rawProgram = await fetchProgramFromRegistry({
    programId,
    config: queryConfigManager.getMainChainConfig(),
  });

  const program = ProgramParser.extractData(rawProgram);

  const { accounts } = program;

  queryConfigManager.setAllChainsConfigIfEmpty(accounts);
  const completeQueryConfig = queryConfigManager.getQueryConfig();

  const accountBalances = await queryAccountBalances(
    accounts,
    completeQueryConfig,
  );

  const metadataToFetch = getDenomsAndChainIds({
    balances: accountBalances,
    accounts,
  });
  const metadata = await fetchAssetMetadata(metadataToFetch);

  const librarySchemas = await fetchLibrarySchemas(program.libraries);
  return {
    queryConfig: completeQueryConfig,
    balances: accountBalances,
    ...program,
    rawProgram,
    metadata,
    librarySchemas: librarySchemas,
  };
};

const fetchProgramFromRegistry = async ({
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

type AccountBalancesReturnValue = Awaited<
  ReturnType<typeof queryAccountBalances>
>;

function getDenomsAndChainIds({
  balances,
  accounts,
}: {
  balances: AccountBalancesReturnValue;
  accounts: NormalizedAccounts;
}) {
  const unflattenedMetadataQueries = balances.map((account) => {
    const acct = Object.values(accounts).find(
      (a) => a.addr === account.address,
    );
    const chainId = acct?.chainId;
    if (!chainId) {
      throw new Error(`No chain ID found for account ${account.address}`);
    }
    const denoms = account.balances.map((balance) => balance.denom);
    return {
      chainId,
      denoms,
    };
  });
  // flatten denomList if same chainId
  const metadataQueries = unflattenedMetadataQueries.reduce(
    (acc, curr) => {
      const existing = acc.find((a) => a.chainId === curr.chainId);
      if (existing) {
        existing.denoms = [...existing.denoms, ...curr.denoms];
      } else {
        acc.push(curr);
      }
      return acc;
    },
    [] as { chainId: string; denoms: string[] }[],
  );

  return metadataQueries;
}

async function fetchLibrarySchemas(libraries: NormalizedLibraries) {
  // TODO: maybe better to pull library addresses from the function data instead.
  const librariesToFetch = Object.values(libraries).reduce((acc, lib) => {
    if (lib.addr && lib.domain?.CosmosCosmwasm === "neutron")
      return [...acc, lib.addr];
    else return [...acc];
  }, [] as string[]);

  const requests = await Promise.all(
    librariesToFetch.map(async (address) => {
      return {
        address,
        schema: await fetchLibrarySchema(address),
      };
    }),
  );

  // todo: for each library, fetch codeId, and use codeId to fetch schema
  const librarySchemas = requests.reduce(
    (acc, { address, schema }) => {
      acc[address] = schema;
      return acc;
    },
    {} as Record<string, FetchLibrarySchemaReturnValue>,
  );
  return librarySchemas;
}
