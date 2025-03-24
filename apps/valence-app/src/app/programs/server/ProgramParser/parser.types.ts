import {
  AuthorizationData,
  type ProgramConfig,
} from "@valence-ui/generated-types";

// there is only one file version, so the normalized types are just the types from the schema. Adjust as needed

export type NormalizedProcessorInfo = {
  address: string;
  chainId: string;
  chainName: string;
  domainName: string;
};

export type CompositeDomains = {
  main: string;
  external: string[];
};

export type NormalizedAuthorizationData = AuthorizationData & {
  processorData: {
    [k: string]: NormalizedProcessorInfo;
  };
};

type NormalizedAccount = ProgramConfig["accounts"][0];
export type NormalizedAccounts = {
  [k: string]: NormalizedAccount & {
    chainId: string;
    chainName: string;
    domainName: string;
  };
};
type NormalizedLibrary = ProgramConfig["libraries"][0];
export type NormalizedLibraries = {
  [k: string]: NormalizedLibrary & {
    chainId: string;
    chainName: string;
    domainName: string;
  };
};
export type NormalizedLinks = ProgramConfig["links"];

export type NormalizedAuthorizations = ProgramConfig["authorizations"];

export interface ProgramParserResult {
  authorizations: NormalizedAuthorizations;
  authorizationData: NormalizedAuthorizationData;
  accounts: NormalizedAccounts;
  links: NormalizedLinks;
  libraries: NormalizedLibraries;
  domains: CompositeDomains;
  owner: string;
  name?: string;
}
