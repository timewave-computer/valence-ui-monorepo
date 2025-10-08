"use server";

import {
  type ErrorCodes,
  getDefaultMainChainConfig,
  getLastUpdatedTime,
  GetProgramErrorCodes,
  makeApiErrors,
  ProgramParser,
  ProgramParserResult,
  type ProgramQueryConfig,
} from "@/app/programs/server";
import { getCosmwasmClient } from "@/server/rpc";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { ProgramRegistryQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/ProgramRegistry.client";
import { ArrayOfProgramResponse } from "@valence-ui/generated-types/dist/cosmwasm/types/ProgramRegistry.types";

type ParsedPrograms = Array<{
  id: number;
  parsed: ProgramParserResult;
  raw: string;
}>;
export type GetAllProgramsReturnValue = {
  dataLastUpdatedAt: number;
  queryConfig: ProgramQueryConfig;
  errors: ErrorCodes;
  parsedPrograms?: ParsedPrograms;
  pagination: PaginationArgs;
};

export type PaginationArgs = {
  lastId: number;
  limit: number;
};

const DEFAULT_PAGINATION: PaginationArgs = {
  lastId: 10000,
  limit: 100,
};

export const getAllProgramsFromRegistry = async ({
  queryConfig: userSuppliedQueryConfig,
  pagination,
}: {
  queryConfig: ProgramQueryConfig | null;
  pagination?: PaginationArgs;
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
      pagination: pagination ?? DEFAULT_PAGINATION,
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
      pagination: pagination ?? DEFAULT_PAGINATION,
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
  let errors: ErrorCodes = [];

  try {
    const programRegistryClient = new ProgramRegistryQueryClient(
      mainChainCosmwasmClient,
      registryAddress,
    );

    if (!pagination) {
      const lastId = await programRegistryClient.getLastId();
      if (!lastId) {
        throw new Error("Registry has no programs");
      }
      pagination = { lastId, limit: DEFAULT_PAGINATION.limit };
    }

    rawPrograms = await fetchAllProgramsFromRegistry({
      registryAddress,
      cosmwasmClient: mainChainCosmwasmClient,
      pagination,
    });
  } catch (e) {
    return {
      pagination: pagination ?? DEFAULT_PAGINATION,
      dataLastUpdatedAt: getLastUpdatedTime(),
      queryConfig: {
        main: mainDomainConfig,
        external: null,
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
      errors = [
        ...errors,
        ...makeApiErrors([
          {
            code: GetProgramErrorCodes.DECODE_BINARY,
            message: `Program ID ${id}: ${e?.message ?? JSON.stringify(e)}`,
          },
        ]),
      ];
      return { id, decodedConfig: {} };
    }
  });

  const parsedPrograms = decodedPrograms.reduce(
    (acc, { id, decodedConfig }) => {
      try {
        const validated = ProgramParser.extractData(decodedConfig);
        acc.push({
          id,
          raw: decodedConfig,
          parsed: validated,
        });
      } catch (e) {
        errors = [
          ...errors,
          ...makeApiErrors([
            {
              code: GetProgramErrorCodes.PARSE,
              message: `Program Id ${id}: ${e?.message ?? JSON.stringify(e)}`,
            },
          ]),
        ];
      }

      return acc;
    },
    [] as ParsedPrograms,
  );

  return {
    pagination: pagination,
    dataLastUpdatedAt: getLastUpdatedTime(), // required for useQuery knowing when to refetch
    queryConfig: { main: mainDomainConfig, external: null },
    errors: errors,
    parsedPrograms: parsedPrograms,
  };
};

const fetchAllProgramsFromRegistry = async ({
  registryAddress,
  cosmwasmClient,
  pagination,
}: {
  registryAddress: string;
  cosmwasmClient: CosmWasmClient;
  pagination: PaginationArgs;
}) => {
  try {
    const programRegistryClient = new ProgramRegistryQueryClient(
      cosmwasmClient,
      registryAddress,
    );

    const endIndex = pagination.lastId + 1;
    const startIndex = Math.max(0, endIndex - pagination.limit);

    // return type on function is incorrect
    return programRegistryClient.getAllConfigs({
      end: endIndex,
      start: startIndex,
      limit: pagination.limit,
    });
  } catch (e) {
    throw new Error(
      `Unable to fetch programs from registry ${registryAddress}. Error: ${e?.message}`,
    );
  }
};
