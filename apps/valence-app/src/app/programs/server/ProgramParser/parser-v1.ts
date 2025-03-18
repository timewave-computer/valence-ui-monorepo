import { z } from "zod";
import {
  defaultDomainName,
  getExternalDomains,
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
      const domainName = value.domain.CosmosCosmwasm;
      if (!domainName) {
        throw new Error(`Domain is not yet supported: ${value.domain} `);
      }
      const registeredChain = chains.find(
        (chain) => chain.chain_name === domainName,
      );
      if (!registeredChain) {
        throw new Error(
          `Unable to set default rpc. Chain name ${domainName} not found in chain registry.`,
        );
      }
      acc[key] = {
        ...value,
        chainId: registeredChain.chain_id,
        chainName: registeredChain.chain_name,
        domainName: domainName,
      };
      return acc;
    },
    {} as NormalizedAccounts,
  );

  const librariesWithChainId = Object.entries(programData.libraries).reduce(
    (acc, [key, value]) => {
      const domainName = value.domain.CosmosCosmwasm;
      if (!domainName) {
        throw new Error(`Domain is not yet supported: ${value.domain} `);
      }
      const registeredChain = chains.find(
        (chain) => chain.chain_name === domainName,
      );
      if (!registeredChain) {
        throw new Error(
          `Unable to detect chainId for chain name ${domainName}. Not found in chain registry.`,
        );
      }
      acc[key] = {
        ...value,
        chainId: registeredChain.chain_id,
        chainName: registeredChain.chain_name,
        domainName: domainName,
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
      const [domainType, domainName] = split;
      if (domainType !== "CosmosCosmwasm") {
        throw new Error(`Processor on unsupported domain: ${domainType} `);
      }

      const registeredChain = chains.find(
        (chain) => chain.chain_name === domainName,
      );

      if (!registeredChain) {
        throw new Error(
          `Unable to find chainId for chain name: ${domainName}. Not found in chain registry.`,
        );
      }
      acc[domainChainName] = {
        address: address,
        chainId: registeredChain.chain_id,
        chainName: registeredChain.chain_name,
        domainName: domainName,
      };
      return acc;
    },
    {} as NormalizedAuthorizationData["processorData"],
  );

  const authorizationData = {
    ...programData.authorization_data,
    processorData: processorsWithChainId,
  };

  const mainDomainName = defaultDomainName; // just default for now

  const domains = {
    main: mainDomainName,
    external: getExternalDomains({
      accounts: accountsWithChainId,
      authorizationData,
      mainDomainName,
    }),
  };

  return {
    owner: programData.owner,
    domains,
    // since there is only 1 format we pretty much just return what what we have for now
    authorizations: programData.authorizations,
    authorizationData: authorizationData,
    accounts: accountsWithChainId,
    libraries: librariesWithChainId,
    links: programData.links,
  };
};
