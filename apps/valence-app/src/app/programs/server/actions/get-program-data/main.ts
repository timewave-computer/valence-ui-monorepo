"use server";
import {
  ProgramParser,
  type ProgramQueryConfig,
  type ProgramParserResult,
  type NormalizedAccounts,
  type FetchLibrarySchemaReturnValue,
  ErrorCodes,
  makeApiErrors,
  getLastUpdatedTime,
  makeExternalDomainConfig,
} from "@/app/programs/server";
import {
  getDefaultMainChainConfig,
  GetProgramErrorCodes,
} from "@/app/programs/server";
import { fetchAssetMetadata } from "@/server/actions";
import { ProgramRegistryQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/ProgramRegistry.client";
import { getCosmwasmClient } from "@/server/rpc";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ArrayOfProcessorCallbackInfo } from "@valence-ui/generated-types/dist/cosmwasm/types/Authorizations.types";
import {
  getProcessorHistory,
  fetchProcessorQueues,
  fetchLibraryConfigs,
  fetchLibrarySchemas,
  queryAccountBalances,
  AccountBalancesReturnValue,
  FetchProcessorQueuesReturnType,
} from ".";
import { ArrayOfMessageBatch } from "@valence-ui/generated-types/dist/cosmwasm/types/Processor.types";

type GetProgramDataProps = {
  programId: string;
  queryConfig?: ProgramQueryConfig;
};

export type GetProgramDataReturnValue = {
  programId: string;
  queryConfig: ProgramQueryConfig;
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
  chainIds?: string[];
};

export const getProgramData = async ({
  programId,
  queryConfig: userSuppliedQueryConfig,
}: GetProgramDataProps): Promise<GetProgramDataReturnValue> => {
  const mainDomainConfig = !!userSuppliedQueryConfig
    ? userSuppliedQueryConfig?.main
    : getDefaultMainChainConfig();

  let rawProgram = "";
  let mainChainCosmwasmClient: CosmWasmClient;
  try {
    mainChainCosmwasmClient = await getCosmwasmClient(mainDomainConfig.rpc);
  } catch (e) {
    return {
      programId: programId,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: {
        main: mainDomainConfig,
        external: null,
      },
      errors: makeApiErrors([
        {
          code: GetProgramErrorCodes.RPC_CONNECTION,
          message: `Could not connect to RPC at ${mainDomainConfig.rpc}`,
        },
      ]),
    };
  }

  if (!mainDomainConfig.registryAddress) {
    return {
      programId: programId,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: {
        main: mainDomainConfig,
        external: null,
      },
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
      registryAddress: mainDomainConfig.registryAddress,
      cosmwasmClient: mainChainCosmwasmClient,
    });
  } catch (e) {
    return {
      programId: programId,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: {
        main: mainDomainConfig,
        external: [],
      },
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
    console.log(`Program ID ${programId} parse error: ${e} `);
    return {
      programId: programId,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: {
        main: mainDomainConfig,
        external: null,
      },
      rawProgram,
      errors: makeApiErrors([{ code: GetProgramErrorCodes.PARSE }]),
    };
  }

  const programChainIds = getChainIds(program);
  const externalDomainNames = program.domains.external;
  const externalDomainConfig = makeExternalDomainConfig({
    externalProgramDomains: externalDomainNames,
    userSuppliedQueryConfig: userSuppliedQueryConfig,
  });
  const completeQueryConfig = {
    main: mainDomainConfig,
    external: externalDomainConfig,
  };

  let accountBalances;
  let metadata;
  let errors = {};

  try {
    accountBalances = await queryAccountBalances(
      program.accounts,
      completeQueryConfig,
    );
  } catch (e) {
    errors = makeApiErrors([
      { code: GetProgramErrorCodes.BALANCES, message: e?.message },
    ]);
  }

  const metadataToFetch = getDenomsAndChainIds({
    balances: accountBalances,
    accounts: program.accounts,
  });
  metadata = await fetchAssetMetadata(metadataToFetch);

  const librarySchemas = await fetchLibrarySchemas(program.libraries);

  const libraryConfigs = await fetchLibraryConfigs(
    program.libraries,
    completeQueryConfig,
  );

  let processorHistory: ArrayOfProcessorCallbackInfo | undefined = undefined;
  let processorQueues: FetchProcessorQueuesReturnType | undefined = undefined;

  const asyncResults = await Promise.allSettled([
    getProcessorHistory({
      rpcUrl: mainDomainConfig.rpc,
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
    chainIds: programChainIds,
  };
};

const getChainIds = (program: ProgramParserResult) => {
  const accountChainIds = Object.values(program.accounts).map((a) => a.chainId);
  const processorChainIds = Object.values(
    program.authorizationData.processorData,
  ).map(({ chainId }) => chainId);
  const allChainIds = [...accountChainIds, ...processorChainIds];
  return Array.from(new Set(allChainIds));
};

async function fetchProgramFromRegistry({
  programId,
  registryAddress,
  cosmwasmClient,
}: {
  programId: string;
  registryAddress: string;
  cosmwasmClient: CosmWasmClient;
}) {
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
}

function getDenomsAndChainIds({
  balances,
  accounts,
}: {
  balances: AccountBalancesReturnValue;
  accounts: NormalizedAccounts;
}) {
  const unflattenedMetadataQueries = balances?.map((account) => {
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
  const metadataQueries = unflattenedMetadataQueries?.reduce(
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

  return metadataQueries ?? [];
}

// in this file to make export out of server action easier to manage
export type FetchProcessorQueuesReturnType = Array<{
  chainName: string;
  processorAddress: string;
  chainId: string;
  queue?: ArrayOfMessageBatch;
}>;
