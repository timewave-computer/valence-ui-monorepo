import { z } from "zod";
import {
  NormalizedAccounts,
  NormalizedAuthorizationData,
  NormalizedLibraries,
  type ParseFunction,
} from "@/app/programs/server";
import { programConfigSchema } from "@valence-ui/generated-types";
import { chains } from "chain-registry";

type ProgramConfigV1 = z.infer<typeof programConfigSchema>;
export const parserV1: ParseFunction<ProgramConfigV1> = (programData) => {
  if (!programData.id) {
    // should not happen, but its generated as optional in the types, so it needs to get handled
    throw new Error("Program config does not have an ID");
  }

  const accountsWithChainId = Object.entries(programData.accounts).reduce(
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
        chainName: chainName,
      };
      return acc;
    },
    {} as NormalizedAccounts,
  );

  const librariesWithChainId = Object.entries(programData.libraries).reduce(
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
          `Unable to detect chainId for chain name ${chainName}. Not found in chain registry.`,
        );
      }
      acc[key] = {
        ...value,
        chainId: registeredChain.chain_id,
        chainName: chainName,
      };
      return acc;
    },
    {} as NormalizedLibraries,
  );

  if (!programData.authorization_data) {
    throw new Error("Invalid program, no authorizations specified");
  }

  const processorsWithChainId = Object.entries(
    programData.authorization_data.processor_addrs ?? {},
  ).reduce(
    (acc, [domainChainName, address]) => {
      const split = domainChainName.split(":");
      if (split.length !== 2) {
        throw new Error(`Invalid domainChainName: ${domainChainName}`);
      }
      const [domain, chainName] = split;
      if (domain !== "CosmosCosmwasm") {
        throw new Error(`Processor on unsupported domain: ${domain} `);
      }

      const registeredChain = chains.find(
        (chain) => chain.chain_name === chainName,
      );

      if (!registeredChain) {
        throw new Error(
          `Unable to find chainId for chain name: ${chainName}. Not found in chain registry.`,
        );
      }
      acc[domainChainName] = {
        address: address,
        chainId: registeredChain.chain_id,
        chainName: chainName,
      };
      return acc;
    },
    {} as NormalizedAuthorizationData["processorData"],
  );

  return {
    // since there is only 1 format we pretty much just return what what we have for now
    authorizations: programData.authorizations,
    authorizationData: {
      ...programData.authorization_data,
      processorData: processorsWithChainId,
    },
    accounts: accountsWithChainId,
    libraries: librariesWithChainId,
    links: programData.links,
  };
};
