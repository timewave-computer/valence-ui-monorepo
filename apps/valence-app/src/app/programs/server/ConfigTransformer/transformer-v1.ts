import { z } from "zod";
import {
  NormalizedAccounts,
  RpcConfigConstructor,
  type TransformerFunction,
} from "@/app/programs/server";
import { programConfigSchema } from "@valence-ui/generated-types";
import { chains } from "chain-registry";

type ProgramConfigV1 = z.infer<typeof programConfigSchema>;
export const transformerV1: TransformerFunction<ProgramConfigV1> = (config) => {
  if (!config.id) {
    // should not happen, but its generated as optional in the types, so it needs to get handled
    throw new Error("Program config does not have an ID");
  }

  const accountsWithChainId = Object.entries(config.accounts).reduce(
    (acc, [key, value]) => {
      const chainName = value.domain.CosmosCosmwasm;
      if (!chainName) {
        throw new Error(`Domain is not yet supported: ${value.domain} `);
      }
      const registeredChain = chains.find(
        (chain) => chain.chain_name === chainName,
      );
      if (!registeredChain) {
        throw new Error(
          `Unable to set default rpc. Chain name ${chainName} not found in chain registry.`,
        );
      }
      acc[key] = {
        ...value,
        chainId: registeredChain.chain_id,
      };
      return acc;
    },
    {} as NormalizedAccounts,
  );

  let rpcConfig = RpcConfigConstructor.create(accountsWithChainId);

  return {
    // since there is only 1 format we pretty much just return what what we have for now
    authorizations: config.authorizations,
    authorizationData: config.authorization_data,
    programId: config.id.toString(),
    accounts: accountsWithChainId,
    libraries: config.libraries,
    links: config.links,
    rpcConfig,
  };
};
