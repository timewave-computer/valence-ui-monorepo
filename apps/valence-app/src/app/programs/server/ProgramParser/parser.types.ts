import { type ProgramConfig } from "@valence-ui/generated-types";

// there is only one file version, so the normalized types are just the types from the schema. Adjust as needed
export type NormalizedAuthorization = ProgramConfig["authorizations"][0];
export type NormalizedAuthorizationData = ProgramConfig["authorization_data"];
type NormalizedAccount = ProgramConfig["accounts"][0];
export type NormalizedAccounts = {
  [k: string]: NormalizedAccount & {
    chainId: string;
  };
};
export type NormalizedLibraries = ProgramConfig["libraries"];
export type NormalizedLinks = ProgramConfig["links"];

export interface ProgramParserResult {
  authorizations: NormalizedAuthorization[];
  authorizationData: NormalizedAuthorizationData;
  accounts: NormalizedAccounts;
  links: NormalizedLinks;
  libraries: NormalizedLibraries;
}
