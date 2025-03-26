import { getCosmwasmClient } from "@/server/rpc";
import { isFulfilled, isRejected } from "@/server/utils";
import { z } from "zod";
import {
  NormalizedLibraries,
  ProgramQueryConfig,
  getDomainConfig,
  fetchLibrarySchema,
  FetchLibrarySchemaReturnValue,
  GetProgramErrorCodes,
  makeApiErrors,
  ErrorCodes,
} from "@/app/programs/server";

export async function fetchLibraryConfigs(
  libraries: NormalizedLibraries,
  queryConfig: ProgramQueryConfig,
) {
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
      try {
        const config = await fetchLibraryConfig({
          rpcUrl: lib.rpcUrl,
          libraryAddress: lib.address,
        });
        return {
          address: lib.address,
          config,
        };
      } catch (error) {
        return Promise.reject({ error, address: lib.address });
      }
    }),
  );

  const successfullRequests = allRequests
    .filter(isFulfilled)
    .map((r) => r.value);
  let errors: ErrorCodes | undefined = undefined;
  const failedRequests = allRequests.filter(isRejected);
  if (failedRequests.length > 0) {
    const failedRequestsErrors = failedRequests.map((r) => {
      const errorMsg =
        r.reason.error?.message || JSON.stringify(r.reason.error);
      return {
        code: GetProgramErrorCodes.LIBRARY_CONFIG,
        message: `Failed to fetch library config for ${r.reason.address}. ${errorMsg}`,
      };
    });

    errors = makeApiErrors(failedRequestsErrors);
  }

  const configs = successfullRequests.reduce(
    (acc, { address, config }) => {
      acc[address] = config;
      return acc;
    },
    {} as Record<string, object>,
  );

  return { configs, errors };
}
export async function fetchLibraryConfig({
  rpcUrl,
  libraryAddress,
}: {
  rpcUrl: string;
  libraryAddress: string;
}): Promise<object> {
  const client = await getCosmwasmClient(rpcUrl);

  const result = await client.queryContractSmart(libraryAddress, {
    get_library_config: {},
  });
  return z.object({}).passthrough().parse(result);
}

/***
 * not supported currently
 */
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
