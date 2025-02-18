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
import { type NullableProgramResponse } from "@valence-ui/generated-types/dist/cosmwasm/types/ProgramRegistry.types";

export type GetAllProgramsReturnValue = {
  dataLastUpdatedAt: number;
  queryConfig: QueryConfig;
  errors: ErrorCodes;
  parsedPrograms?: Record<number, ProgramParserResult | undefined>;
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

  let rawPrograms: NullableProgramResponse;
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

  const decodedPrograms = rawPrograms?.map(([id, binaryString]) => {
    try {
      const decodedString = atob(binaryString);
      const decodedConfig = JSON.parse(decodedString);
      return [id, decodedConfig];
    } catch (e) {
      errors = makeApiErrors([
        {
          code: GetProgramErrorCodes.DECODE_BINARY,
          message: e?.message,
        },
      ]);
    }
  });

  const parsedPrograms = decodedPrograms.reduce(
    (acc, [id, config]) => {
      try {
        const validated = ProgramParser.extractData(config);
        acc[id] = validated;
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
    {} as Array<[number, ProgramParserResult | undefined]>,
  );

  return {
    dataLastUpdatedAt: getLastUpdatedTime(),
    queryConfig: queryConfigManager.getQueryConfig(),
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

    return programRegistryClient.getAllConfigs({
      limit: 20,
    });
  } catch (e) {
    throw new Error(
      `Unable to fetch programs from registry ${registryAddress}. Error: ${e?.message}`,
    );
  }
};
