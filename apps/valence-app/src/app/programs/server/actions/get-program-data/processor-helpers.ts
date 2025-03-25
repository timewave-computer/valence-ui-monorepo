import { getCosmwasmClient } from "@/server/rpc";
import { AuthorizationsQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Authorizations.client";
import { ArrayOfProcessorCallbackInfo } from "@valence-ui/generated-types/dist/cosmwasm/types/Authorizations.types";
import { ProcessorQueryClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Processor.client";
import { ArrayOfMessageBatch } from "@valence-ui/generated-types/dist/cosmwasm/types/Processor.types";
import {
  FetchProcessorQueuesReturnType,
  getDomainConfig,
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
}): Promise<FetchProcessorQueuesReturnType> {
  if (!processorAddresses) return [];

  const requests = Object.values(processorAddresses).map(
    async ({ chainId, chainName, address: processorAddress, domainName }) => {
      const rpcUrl = getDomainConfig({ queryConfig, domainName })?.rpc;

      const processorMetadata = {
        chainName,
        domainName,
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

export async function getProcessorQueue({
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
