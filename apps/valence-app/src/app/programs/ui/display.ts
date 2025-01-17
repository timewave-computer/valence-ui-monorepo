import { AuthorizationModeInfo, Domain } from "@valence-ui/generated-types";

export const displayDomain = (domain: Domain) => {
  return Object.values(domain)[0];
};

export const displayAuthMode = (authMode: AuthorizationModeInfo) => {
  if (typeof authMode === "string" && authMode === "permissionless") {
    return authMode;
  } else return "permissioned";
};
