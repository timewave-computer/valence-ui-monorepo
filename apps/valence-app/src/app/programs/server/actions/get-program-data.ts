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
  processorQueues?: FetchProcessorQueuesReturnType;
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
  const mainChainConfig = queryConfigManager.getMainChainConfig();

  let mainChainCosmwasmClient: CosmWasmClient;
  try {
    mainChainCosmwasmClient = await getCosmwasmClient(mainChainConfig.rpcUrl);
  } catch (e) {
    return {
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
    queryConfigManager.setAllChainsConfigIfEmpty({});
    return {
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
  queryConfigManager.setAllChainsConfigIfEmpty({});

  try {
    program = ProgramParser.extractData(rawProgram);
  } catch (e) {
    queryConfigManager.setAllChainsConfigIfEmpty({});
    console.log(`Program ID ${programId} parse error: ${e} `);
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

  // TODO: make an object of all chain clients, with chain id and chain name
  const processorQueues = await fetchProcessorQueues({
    processorAddresses: program.authorizationData?.processor_addrs,
    queryConfig: completeQueryConfig,
  });

  return {
    dataLastUpdatedAt: getLastUpdatedTime(), // for handling stale time in react-query
    queryConfig: completeQueryConfig,
    balances: accountBalances,
    parsedProgram: program,
    rawProgram,
    metadata,
    librarySchemas: librarySchemas,
    errors: errors,
    processorQueues: processorQueues,
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

type FetchProcessorQueuesReturnType = Array<{
  chainName: string;
  processorAddress: string;
  queue?: ArrayOfMessageBatch;
}>;
async function fetchProcessorQueues({
  processorAddresses,
  queryConfig,
}: {
  processorAddresses?: AuthorizationData["processor_addrs"];
  queryConfig: QueryConfig;
}): Promise<FetchProcessorQueuesReturnType> {
  if (!processorAddresses) return [];
  const requests = Object.entries(processorAddresses).map(
    async ([domainChainName, processorAddress]) => {
      const [domain, chainName] = domainChainName.split(":");

      const rpcUrl =
        queryConfig.main.name === chainName
          ? queryConfig.main.rpcUrl
          : queryConfig.external.find((chain) => chain.name === chainName)?.rpc;

      const processorMetadata = {
        chainName,
        processorAddress,
      };

      let queue: ArrayOfMessageBatch | undefined = undefined;
      if (domain == "CosmosCosmwasm") {
        // todo: display some unsupported error
        queue = rpcUrl
          ? await getProcessorQueue({
              rpcUrl,
              processorAddress,
            })
          : undefined;
      }

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
  const processorClient = new ProcessorQueryClient(
    await getCosmwasmClient(rpcUrl),
    processorAddress,
  );

  const results = await Promise.all([
    processorClient.getQueue({ priority: "high" }),
    processorClient.getQueue({ priority: "medium" }),
  ]);
  return results.flat();
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
