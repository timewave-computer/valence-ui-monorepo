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
  ErrorCodes,
  makeApiErrors,
} from "@/app/programs/server";
import {
  getDefaultMainChainConfig,
  fetchLibrarySchema,
  GetProgramErrorCodes,
} from "@/app/programs/server";
import { fetchAssetMetadata } from "@/server/actions";
import { UTCDate } from "@date-fns/utc";

type GetProgramDataProps = {
  programId: string;
  queryConfig?: QueryConfig;
};

export type GetProgramDataReturnValue = {
  queryConfig: QueryConfig;
  balances?: AccountBalancesReturnValue;
  parsedProgram?: ProgramParserResult;
  rawProgram?: string;
  metadata?: Record<string, any>;
  librarySchemas?: Record<string, FetchLibrarySchemaReturnValue>;
  errors?: ErrorCodes;
  dataLastUpdatedAt: number; // for handling stale time in react-query
};

// TODO: make a 'response' builder so error handling is cleaner / func more readable / testable
export const getProgramData = async ({
  programId,
  queryConfig: userSuppliedQueryConfig,
}: GetProgramDataProps): Promise<GetProgramDataReturnValue> => {
  let queryConfigManager = new QueryConfigManager(
    userSuppliedQueryConfig ?? {
      main: getDefaultMainChainConfig(),
      external: undefined, // needs to be derived from accounts in config
    },
  );
  // must default registry address and mainchain RPC if no config given
  let rawProgram = "";
  try {
    rawProgram = await fetchProgramFromRegistry({
      programId,
      config: queryConfigManager.getMainChainConfig(),
    });
  } catch (e) {
    queryConfigManager.setAllChainsConfigIfEmpty({});
    return {
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: queryConfigManager.getQueryConfig(),
      errors: makeApiErrors([{ code: GetProgramErrorCodes.REGISTRY }]),
    };
  }

  let program: ProgramParserResult;
  queryConfigManager.setAllChainsConfigIfEmpty({});

  try {
    program = ProgramParser.extractData(rawProgram);
  } catch (e) {
    queryConfigManager.setAllChainsConfigIfEmpty({});
    return {
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: queryConfigManager.getQueryConfig(),
      rawProgram,
      errors: makeApiErrors([{ code: GetProgramErrorCodes.PARSE }]),
    };
  }

  const { accounts } = program;
  queryConfigManager.setAllChainsConfigIfEmpty(accounts);
  const completeQueryConfig = queryConfigManager.getQueryConfig();

  let accountBalances;
  let metadata;
  let errors = {};

  try {
    accountBalances = await queryAccountBalances(accounts, completeQueryConfig);
    console.log("FETCHED ACCOUNT BALANCES", JSON.stringify(accountBalances));
    const metadataToFetch = getDenomsAndChainIds({
      balances: accountBalances,
      accounts,
    });
    console.log("FETCHING METADATA", JSON.stringify(metadataToFetch));

    metadata = await fetchAssetMetadata(metadataToFetch);
  } catch (e) {
    console.log("there was an error", e);
    errors = makeApiErrors([
      { code: GetProgramErrorCodes.BALANCES, message: e?.message },
    ]);
  }

  const librarySchemas = await fetchLibrarySchemas(program.libraries);
  return {
    dataLastUpdatedAt: getLastUpdatedTime(),
    queryConfig: completeQueryConfig,
    balances: accountBalances,
    parsedProgram: program,
    rawProgram,
    metadata,
    librarySchemas: librarySchemas,
    errors: errors,
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

    let rpcUrl: string | undefined = undefined;
    if (account.chainName === config.main.name) {
      rpcUrl = config.main.rpc;
    } else {
      rpcUrl = config.external.find(
        (chain) => chain.name === account.chainName,
      )?.rpc;
    }

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

const getLastUpdatedTime = () => {
  return new UTCDate().getTime();
};
