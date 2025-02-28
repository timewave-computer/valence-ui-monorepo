import {
  AuthorizationModeInfo,
  Domain,
  Subroutine,
} from "@valence-ui/generated-types";
import { getSubroutineType, isPermissionless } from "@/app/programs/ui";
import { isPermissioned, isPermissionWithLimit } from "@/app/programs/server";

export const displayDomain = (domain: Domain) => {
  return Object.values(domain)[0];
};

export const displayAuthMode = (authMode: AuthorizationModeInfo) => {
  return isPermissionless(authMode) ? "permissionless" : "permissioned";
};

export const displaySubroutineType = (subroutine: Subroutine) => {
  return getSubroutineType(subroutine).toUpperCase();
};

export const jsonToIndentedText = (body: object): string => {
  return JSON.stringify(body, null, 2);
};
export function countJsonKeys(obj: any): number {
  let count = 0;

  function countKeys(o: any) {
    if (typeof o === "object" && o !== null) {
      for (const key in o) {
        if (o.hasOwnProperty(key)) {
          count++;
          countKeys(o[key]);
        }
      }
    }
  }

  countKeys(obj);
  return count;
}

export const displayLibraryContractName = (name?: string) => {
  if (!name) return "Library"; // todo, should be uppercase 'unregistered contract', once we have library registry
  return name.toUpperCase();
};

export const displayAccountName = (name: string) => {
  return name.toUpperCase();
};

export const permissionFactoryDenom = ({
  authorizationsAddress,
  authorizationLabel,
}: {
  authorizationsAddress: string;
  authorizationLabel: string;
}) => {
  return `factory/${authorizationsAddress}/${authorizationLabel}`;
};

export const getExecutionLimit = (
  authorizationMode: AuthorizationModeInfo,
): string | null => {
  if (isPermissionless(authorizationMode)) {
    return null;
  }
  if (isPermissioned(authorizationMode)) {
    if (isPermissionWithLimit(authorizationMode.permissioned)) {
      // TODO: confused
      return authorizationMode.permissioned.with_call_limit[0][1];
    }
  }
  return null;
};
