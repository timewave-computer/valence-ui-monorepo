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
  GET_PROGRAM_ERROR_CODES,
  GetProgramErrorCodes,
} from "@/app/programs/server";
import { fetchAssetMetadata } from "@/server/actions";

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
  errors?: any;
};

// defined separetely to isolate the return type
export const getProgramData = async ({
  programId,
  queryConfig: userSuppliedQueryConfig,
}: GetProgramDataProps): Promise<GetProgramDataReturnValue> => {
  let queryConfigManager = new QueryConfigManager(
    userSuppliedQueryConfig ?? {
      main: getDefaultMainChainConfig(),
      allChains: undefined, // need to construct this from accounts
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
      queryConfig: queryConfigManager.getQueryConfig(),
      errors: {
        [GetProgramErrorCodes.REGISTRY]: {
          ...GET_PROGRAM_ERROR_CODES[GetProgramErrorCodes.REGISTRY],
          message: JSON.stringify(e),
        },
      },
    };
  }

  let program: ProgramParserResult;
  queryConfigManager.setAllChainsConfigIfEmpty({});

  try {
    program = ProgramParser.extractData(rawProgram);
  } catch (e) {
    queryConfigManager.setAllChainsConfigIfEmpty({});
    return {
      queryConfig: queryConfigManager.getQueryConfig(),
      rawProgram,
      errors: {
        [GetProgramErrorCodes.PARSE]: {
          ...GET_PROGRAM_ERROR_CODES[GetProgramErrorCodes.PARSE],
          message: JSON.stringify(e),
        },
      },
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

    const metadataToFetch = getDenomsAndChainIds({
      balances: accountBalances,
      accounts,
    });
    metadata = await fetchAssetMetadata(metadataToFetch);
  } catch (e) {
    errors[GetProgramErrorCodes.BALANCES] = {
      ...GET_PROGRAM_ERROR_CODES[GetProgramErrorCodes.BALANCES],
      message: JSON.stringify(e),
    };
  }

  const librarySchemas = await fetchLibrarySchemas(program.libraries);
  return {
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
