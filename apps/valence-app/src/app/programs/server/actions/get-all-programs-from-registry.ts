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
  const isUserSuppliedArgs = !!userSuppliedQueryConfig;

  const mainDomainConfig = isUserSuppliedArgs
    ? userSuppliedQueryConfig?.main
    : getDefaultMainChainConfig();

  let mainChainCosmwasmClient: CosmWasmClient;
  try {
    mainChainCosmwasmClient = await getCosmwasmClient(mainDomainConfig.rpc);
  } catch (e) {
    return {
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

  const registryAddress = mainDomainConfig.registryAddress;
  if (!registryAddress) {
    return {
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

  let rawPrograms: ArrayOfProgramResponse;
  let errors = {};

  try {
    rawPrograms = await fetchAllProgramsFromRegistry({
      registryAddress,
      cosmwasmClient: mainChainCosmwasmClient,
    });
  } catch (e) {
    return {
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: {
        main: mainDomainConfig,
        external: undefined,
      },
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
    dataLastUpdatedAt: getLastUpdatedTime(), // required for useQuery knowing when to refetch
    queryConfig: { main: mainDomainConfig, external: null },
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

    const lastId = await programRegistryClient.getLastId();
    if (!lastId) {
      throw new Error("Registry has no programs");
    }

    const limit = 20;
    const endIndex = lastId + 1;

    // return type on function is incorrect
    return programRegistryClient.getAllConfigs({
      limit: limit,
      end: endIndex,
      start: endIndex - limit,
    });
  } catch (e) {
    throw new Error(
      `Unable to fetch programs from registry ${registryAddress}. Error: ${e?.message}`,
    );
  }
};
