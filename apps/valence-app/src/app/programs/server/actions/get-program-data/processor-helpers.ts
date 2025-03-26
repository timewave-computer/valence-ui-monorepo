import { getCosmwasmClient } from "@/server/rpc";
import { AuthorizationsQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Authorizations.client";
import { ArrayOfProcessorCallbackInfo } from "@valence-ui/generated-types/dist/cosmwasm/types/Authorizations.types";
import { ProcessorQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Processor.client";
import { ArrayOfMessageBatch } from "@valence-ui/generated-types/dist/cosmwasm/types/Processor.types";
import {
  ErrorCodes,
  FetchProcessorQueuesReturnType,
  getDomainConfig,
  GetProgramErrorCodes,
  makeApiErrors,
  NormalizedAuthorizationData,
  ProgramQueryConfig,
} from "@/app/programs/server";

export async function getProcessorHistory({
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

export async function fetchProcessorQueues({
  processorAddresses,
  queryConfig,
}: {
  processorAddresses?: NormalizedAuthorizationData["processorData"];
  queryConfig: ProgramQueryConfig;
}): Promise<{ results: FetchProcessorQueuesReturnType; errors: ErrorCodes }> {
  if (!processorAddresses)
    return {
      results: [],
      errors: makeApiErrors([
        {
          code: GetProgramErrorCodes.PROCESSOR_QUEUE,
          message: `No processor addresses found`,
        },
      ]),
    };

  const errors: ErrorCodes = [];
  let results: ArrayOfMessageBatch = [];

  const requests = Object.values(processorAddresses).map(
    async ({ chainId, chainName, address: processorAddress, domainName }) => {
      const rpcUrl = getDomainConfig({ queryConfig, domainName })?.rpc;

      const processorMetadata = {
        chainName,
        domainName,
        processorAddress,
        chainId,
      };

      if (!rpcUrl) {
        errors.push(
          ...makeApiErrors([
            {
              code: GetProgramErrorCodes.PROCESSOR_QUEUE,
              message: `RPC URL not found for ${processorAddress}`,
            },
          ]),
        );
      } else {
        const processorQueueRequest = await getProcessorQueue({
          rpcUrl,
          processorAddress,
        });
        results = processorQueueRequest.results;
        errors.push(...processorQueueRequest.errors);
      }

      return {
        ...processorMetadata,
        queue: results,
      };
    },
  );

  const awaitedResults = (await Promise.all(requests)).flat();
  return { results: awaitedResults, errors };
}

export async function getProcessorQueue({
  rpcUrl,
  processorAddress,
}: {
  rpcUrl: string;
  processorAddress: string;
}): Promise<{ results: ArrayOfMessageBatch; errors: ErrorCodes }> {
  try {
    const processorClient = new ProcessorQueryClient(
      await getCosmwasmClient(rpcUrl),
      processorAddress,
    );

    const results = await Promise.all([
      processorClient.getQueue({ priority: "high" }),
      processorClient.getQueue({ priority: "medium" }),
    ]);
    return { results: results.flat(), errors: [] };
  } catch (e) {
    const errMsg = !!e?.message ? e.message : JSON.stringify(e);
    return {
      results: [],
      errors: makeApiErrors([
        {
          code: GetProgramErrorCodes.PROCESSOR_QUEUE,
          message: `Failed to fetch processor queue for ${processorAddress}. ${errMsg}`,
        },
      ]),
    };
  }
}
