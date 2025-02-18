"use server";

import {
  type ErrorCodes,
  getDefaultMainChainConfig,
  getLastUpdatedTime,
  GetProgramErrorCodes,
  makeApiErrors,
  ProgramParser,
  ProgramParserResult,
  type QueryConfig,
  QueryConfigManager,
} from "@/app/programs/server";
import { getCosmwasmClient } from "@/server/rpc";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ProgramRegistryQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/ProgramRegistry.client";
import { ArrayOfProgramResponse } from "@valence-ui/generated-types/dist/cosmwasm/types/ProgramRegistry.types";

type ParsedPrograms = Array<{ id: number; config: ProgramParserResult }>;
export type GetAllProgramsReturnValue = {
  dataLastUpdatedAt: number;
  queryConfig: QueryConfig;
  errors: ErrorCodes;
  parsedPrograms?: ParsedPrograms;
};

export const getAllProgramsFromRegistry = async ({
  queryConfig: userSuppliedQueryConfig,
}: {
  queryConfig: QueryConfig | null;
}): Promise<GetAllProgramsReturnValue> => {
  let queryConfigManager = new QueryConfigManager(
    userSuppliedQueryConfig ?? {
      main: getDefaultMainChainConfig(),
      external: undefined, // needs to be derived from accounts in config
    },
  );
  // must default registry address and mainchain RPC if no config given
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

  const registryAddress = mainChainConfig.registryAddress;
  if (!registryAddress) {
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

  let rawPrograms: ArrayOfProgramResponse;
  let errors = {};

  try {
    rawPrograms = await fetchAllProgramsFromRegistry({
      registryAddress,
      cosmwasmClient: mainChainCosmwasmClient,
    });
  } catch (e) {
    queryConfigManager.setAllChainsConfigIfEmpty({});
    return {
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: queryConfigManager.getQueryConfig(),
      errors: makeApiErrors([
        {
          code: GetProgramErrorCodes.INVALID_REGISTRY,
          message: e?.message,
        },
      ]),
    };
  }

  const decodedPrograms = rawPrograms.map(({ id, program_config }) => {
    try {
      const decodedBinaryString = atob(program_config);
      const decodedConfig = JSON.parse(decodedBinaryString);
      return { id, decodedConfig };
    } catch (e) {
      errors = makeApiErrors([
        {
          code: GetProgramErrorCodes.DECODE_BINARY,
          message: e?.message,
        },
      ]);
      return { id, decodedConfig: {} };
    }
  });

  const parsedPrograms = decodedPrograms.reduce(
    (acc, { id, decodedConfig }) => {
      try {
        const validated = ProgramParser.extractData(decodedConfig);

        acc.push({
          id,
          config: validated,
        });
      } catch (e) {
        errors = makeApiErrors([
          {
            code: GetProgramErrorCodes.PARSE,
            message: e?.message,
          },
        ]);
      }

      return acc;
    },
    [] as ParsedPrograms,
  );

  return {
    dataLastUpdatedAt: getLastUpdatedTime(),
    queryConfig: queryConfigManager.getQueryConfig(), // needed to decide if refetch needed in useQuery
    errors: {},
    parsedPrograms: parsedPrograms,
  };
};

const fetchAllProgramsFromRegistry = async ({
  registryAddress,
  cosmwasmClient,
}: {
  registryAddress: string;
  cosmwasmClient: CosmWasmClient;
}) => {
  try {
    const programRegistryClient = new ProgramRegistryQueryClient(
      cosmwasmClient,
      registryAddress,
    );

    // return type on function is incorrect
    return programRegistryClient.getAllConfigs({
      limit: 20,
    });
  } catch (e) {
    throw new Error(
      `Unable to fetch programs from registry ${registryAddress}. Error: ${e?.message}`,
    );
  }
};
