import {
  AuthorizationModeInfo,
  Domain,
  Subroutine,
} from "@valence-ui/generated-types";
import { getSubroutineType, isPermissionless } from "@/app/programs/ui";
import { fromUnixTime } from "date-fns";

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

export const displayUnixTimeAsUtc = (date?: number) => {
  // 1744133294 -> "4/8/2025, 2:35:14 PM"
  if (!date) return;
  return fromUnixTime(date).toLocaleString();
};
