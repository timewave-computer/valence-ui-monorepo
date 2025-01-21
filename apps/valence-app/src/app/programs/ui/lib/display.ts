import {
  AuthorizationModeInfo,
  Domain,
  Subroutine,
} from "@valence-ui/generated-types";
import { getSubroutineType, isPermissionless } from "@/app/programs/ui";

export const displayDomain = (domain: Domain) => {
  return Object.values(domain)[0];
};

export const displayAuthMode = (authMode: AuthorizationModeInfo) => {
  return isPermissionless(authMode) ? "permissionless" : "permissioned";
};

export const displaySubroutineType = (subroutine: Subroutine) => {
  return getSubroutineType(subroutine).toUpperCase();
};
