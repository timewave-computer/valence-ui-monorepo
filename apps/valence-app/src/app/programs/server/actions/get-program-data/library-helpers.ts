import { getCosmwasmClient } from "@/server/rpc";
import { isFulfilled } from "@/server/utils";
import { z } from "zod";
import {
  NormalizedLibraries,
  ProgramQueryConfig,
  getDomainConfig,
  fetchLibrarySchema,
  FetchLibrarySchemaReturnValue,
} from "@/app/programs/server";

export async function fetchLibrarySchemas(libraries: NormalizedLibraries) {
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

export async function fetchLibraryConfig({
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

export async function fetchLibraryConfigs(
  libraries: NormalizedLibraries,
  queryConfig: ProgramQueryConfig,
) {
  // TODO: maybe better to pull library addresses from the function data instead.
  const librariesToFetch = Object.values(libraries).reduce(
    (acc, lib) => {
      if (lib.addr && lib.domainName) {
        const rpcUrl = getDomainConfig({
          queryConfig,
          domainName: lib.domainName,
        })?.rpc;
        if (rpcUrl) {
          return [
            ...acc,
            {
              chainId: lib.chainId,
              address: lib.addr,
              rpcUrl: rpcUrl,
            },
          ];
        } else return [...acc];
      } else return [...acc];
    },
    [] as Array<{ address: string; chainId: string; rpcUrl: string }>,
  );

  const allRequests = await Promise.allSettled(
    librariesToFetch.map(async (lib) => {
      return {
        address: lib.address,
        config: await fetchLibraryConfig({
          rpcUrl: lib.rpcUrl,
          libraryAddress: lib.address,
        }),
      };
    }),
  );

  const requests = allRequests.filter(isFulfilled).map((r) => r.value);

  const configs = requests.reduce(
    (acc, { address, config }) => {
      acc[address] = config;
      return acc;
    },
    {} as Record<string, object>,
  );
  return configs;
}
