"use server";
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
  getLastUpdatedTime,
  NormalizedAuthorizationData,
} from "@/app/programs/server";
import {
  getDefaultMainChainConfig,
  fetchLibrarySchema,
  GetProgramErrorCodes,
} from "@/app/programs/server";
import { fetchAssetMetadata } from "@/server/actions";
import { ProgramRegistryQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/ProgramRegistry.client";
import { getCosmwasmClient } from "@/server/rpc";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ProcessorQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Processor.client";
import { AuthorizationData } from "@valence-ui/generated-types";
import { ArrayOfMessageBatch } from "@valence-ui/generated-types/dist/cosmwasm/types/Processor.types";
import { AuthorizationsQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Authorizations.client";
import { ArrayOfProcessorCallbackInfo } from "@valence-ui/generated-types/dist/cosmwasm/types/Authorizations.types";
import { z } from "zod";
import { isFulfilled } from "@/server/utils";

type GetProgramDataProps = {
  programId: string;
  queryConfig?: QueryConfig;
};

export type GetProgramDataReturnValue = {
  programId: string;
  queryConfig: QueryConfig;
  balances?: AccountBalancesReturnValue;
  parsedProgram?: ProgramParserResult;
  rawProgram?: string;
  metadata?: Record<string, any>;
  librarySchemas?: Record<string, FetchLibrarySchemaReturnValue>;
  libraryConfigs?: Record<string, object>;
  errors?: ErrorCodes;
  dataLastUpdatedAt: number; // for handling stale time in react-query
  processorQueues?: FetchProcessorQueuesReturnType;
  processorHistory?: ArrayOfProcessorCallbackInfo;
};

// TODO: make a 'response' builder so error handling is cleaner / func more readable / testable
// TODO: make an object of all chain clients, with chain id and chain name
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
  const mainChainConfig = queryConfigManager.getMainChainConfig();

  let mainChainCosmwasmClient: CosmWasmClient;
  try {
    mainChainCosmwasmClient = await getCosmwasmClient(mainChainConfig.rpcUrl);
  } catch (e) {
    return {
      programId: programId,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: queryConfigManager.getQueryConfig(),
      errors: makeApiErrors([
        {
          code: GetProgramErrorCodes.RPC_CONNECTION,
          message: `Could not connect to RPC at ${mainChainConfig.rpcUrl}`,
        },
      ]),
    };
  }

  if (!mainChainConfig.registryAddress) {
    return {
      programId: programId,

      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: queryConfigManager.getQueryConfig(),
      errors: makeApiErrors([
        {
          code: GetProgramErrorCodes.NO_REGISTRY,
        },
      ]),
    };
  }

  try {
    rawProgram = await fetchProgramFromRegistry({
      programId,
      registryAddress: mainChainConfig.registryAddress,
      cosmwasmClient: mainChainCosmwasmClient,
    });
  } catch (e) {
    queryConfigManager.setAllChainsConfigIfEmpty(null);
    return {
      programId: programId,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: queryConfigManager.getQueryConfig(),
      errors: makeApiErrors([
        {
          code: GetProgramErrorCodes.PROGRAM_ID_NOT_FOUND,
          message: e?.message,
        },
      ]),
    };
  }

  let program: ProgramParserResult;

  try {
    program = ProgramParser.extractData(rawProgram);
  } catch (e) {
    queryConfigManager.setAllChainsConfigIfEmpty(null);
    console.log(`Program ID ${programId} parse error: ${e} `);
    return {
      programId: programId,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: queryConfigManager.getQueryConfig(),
      rawProgram,
      errors: makeApiErrors([{ code: GetProgramErrorCodes.PARSE }]),
    };
  }
  // for all processors and accounts, populate external chains

  const { accounts } = program;
  queryConfigManager.setAllChainsConfigIfEmpty(program);
  const completeQueryConfig = queryConfigManager.getQueryConfig();

  let accountBalances;
  let metadata;
  let errors = {};

  try {
    accountBalances = await queryAccountBalances(accounts, completeQueryConfig);
  } catch (e) {
    errors = makeApiErrors([
      { code: GetProgramErrorCodes.BALANCES, message: e?.message },
    ]);
  }

  const metadataToFetch = getDenomsAndChainIds({
    balances: accountBalances,
    accounts,
  });

  metadata = await fetchAssetMetadata(metadataToFetch);

  const librarySchemas = await fetchLibrarySchemas(program.libraries);

  const libraryConfigs = await fetchLibraryConfigs(
    program.libraries,
    mainChainConfig.rpcUrl,
  );

  let processorHistory: ArrayOfProcessorCallbackInfo | undefined = undefined;
  let processorQueues: FetchProcessorQueuesReturnType | undefined = undefined;
  const asyncResults = await Promise.allSettled([
    getProcessorHistory({
      rpcUrl: mainChainConfig.rpcUrl,
      authorizationsAddress: program.authorizationData?.authorization_addr,
    }),
    fetchProcessorQueues({
      processorAddresses: program.authorizationData.processorData,
      queryConfig: completeQueryConfig,
    }),
  ]);

  if (asyncResults[0].status === "rejected") {
    errors = {
      ...errors,
      ...makeApiErrors([
        {
          code: GetProgramErrorCodes.EXECUTION_HISTORY,
          message: asyncResults[0].reason?.message,
        },
      ]),
    };
  } else if (asyncResults[0].status === "fulfilled") {
    processorHistory = asyncResults[0].value;
  }

  // TODO: the processor queue errors will not bubble up
  if (asyncResults[1].status === "rejected") {
    errors = {
      ...errors,
      ...makeApiErrors([
        {
          code: GetProgramErrorCodes.PROCESSOR_QUEUE,
          message: asyncResults[1].reason?.message,
        },
      ]),
    };
  } else if (asyncResults[1].status === "fulfilled") {
    processorQueues = asyncResults[1].value;
  }

  return {
    programId: programId,
    dataLastUpdatedAt: getLastUpdatedTime(), // for handling stale time in react-query
    queryConfig: completeQueryConfig, // needed to decide if refetch needed in useQuery
    balances: accountBalances,
    parsedProgram: program,
    rawProgram,
    metadata,
    librarySchemas: librarySchemas,
    errors: errors,
    processorQueues: processorQueues,
    processorHistory: processorHistory,
    libraryConfigs: libraryConfigs,
  };
};

const fetchProgramFromRegistry = async ({
  programId,
  registryAddress,
  cosmwasmClient,
}: {
  programId: string;
  registryAddress: string;
  cosmwasmClient: CosmWasmClient;
}) => {
  try {
    const programRegistryClient = new ProgramRegistryQueryClient(
      cosmwasmClient,
      registryAddress,
    );
    // TODO: there should be two errors, program not found, and contract is not a registry
    const response = await programRegistryClient.getConfig({
      id: Number(programId),
    });
    const binaryString = response.program_config;
    const decodedString = atob(binaryString);
    const programConfig = JSON.parse(decodedString);

    return programConfig;
  } catch (e) {
    throw new Error(
      `Unable to fetch program ID ${programId} from registry ${registryAddress}. Error: ${e?.message}`,
    );
  }
};

const getAllDomains = ({
  accounts,
  processors,
}: {
  accounts: ProgramParserResult["accounts"];
  processors: ProgramParserResult["authorizationData"]["processor_addrs"];
}) => {};

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
      rpcUrl = config.main.rpcUrl;
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

export type FetchProcessorQueuesReturnType = Array<{
  chainName: string;
  processorAddress: string;
  chainId: string;
  queue?: ArrayOfMessageBatch;
}>;
async function fetchProcessorQueues({
  processorAddresses,
  queryConfig,
}: {
  processorAddresses?: NormalizedAuthorizationData["processorData"];
  queryConfig: QueryConfig;
}): Promise<FetchProcessorQueuesReturnType> {
  if (!processorAddresses) return [];

  const requests = Object.entries(processorAddresses).map(
    async ([
      domainChainName,
      { chainId, chainName, address: processorAddress },
    ]) => {
      const rpcUrl =
        queryConfig.main.chainId === chainId
          ? queryConfig.main.rpcUrl
          : queryConfig.external.find((chain) => chain.chainId === chainId)
              ?.rpc;

      const processorMetadata = {
        chainName,
        processorAddress,
        chainId,
      };

      const queue = rpcUrl
        ? await getProcessorQueue({
            rpcUrl,
            processorAddress,
          })
        : undefined;

      return {
        ...processorMetadata,
        queue,
      };
    },
  );

  const awaitedResults = (await Promise.all(requests)).flat();
  return awaitedResults;
}

async function getProcessorQueue({
  rpcUrl,
  processorAddress,
}: {
  rpcUrl: string;
  processorAddress: string;
}): Promise<ArrayOfMessageBatch> {
  try {
    const processorClient = new ProcessorQueryClient(
      await getCosmwasmClient(rpcUrl),
      processorAddress,
    );

    const results = await Promise.all([
      processorClient.getQueue({ priority: "high" }),
      processorClient.getQueue({ priority: "medium" }),
    ]);
    return results.flat();
  } catch (e) {
    console.log(`Error fetching processor queue: ${e}`);
    return [];
  }
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

async function fetchLibraryConfig({
  rpcUrl,
  libraryAddress,
}: {
  rpcUrl: string;
  libraryAddress: string;
}): Promise<object> {
  try {
    const client = await getCosmwasmClient(rpcUrl);

    const result = await client.queryContractSmart(libraryAddress, {
      get_library_config: {},
    });
    return z.object({}).passthrough().parse(result);
  } catch (e) {
    console.log(`Error fetching library config: ${e}`);
    return Promise.reject(e);
  }
}

async function fetchLibraryConfigs(
  libraries: NormalizedLibraries,
  rpcUrl: string,
) {
  // TODO: maybe better to pull library addresses from the function data instead.
  const librariesToFetch = Object.values(libraries).reduce((acc, lib) => {
    if (lib.addr && !!lib.domain?.CosmosCosmwasm) return [...acc, lib.addr];
    else return [...acc];
  }, [] as string[]);

  const allRequests = await Promise.allSettled(
    librariesToFetch.map(async (address) => {
      return {
        address,
        schema: await fetchLibraryConfig({
          rpcUrl,
          libraryAddress: address,
        }),
      };
    }),
  );

  const requests = allRequests.filter(isFulfilled).map((r) => r.value);

  const configs = requests.reduce(
    (acc, { address, schema }) => {
      acc[address] = schema;
      return acc;
    },
    {} as Record<string, object>,
  );
  return configs;
}

async function getProcessorHistory({
  rpcUrl,
  authorizationsAddress,
}: {
  rpcUrl: string;
  authorizationsAddress?: string;
}): Promise<ArrayOfProcessorCallbackInfo> {
  if (!authorizationsAddress) {
    return Promise.reject(new Error("No authorizations address found"));
  }
  try {
    const authorizationsClient = new AuthorizationsQueryClient(
      await getCosmwasmClient(rpcUrl),
      authorizationsAddress,
    );
    return authorizationsClient.processorCallbacks({});
  } catch (e) {
    console.log(`Error fetching processor history: ${e}`);
    return Promise.reject(e);
  }
}
