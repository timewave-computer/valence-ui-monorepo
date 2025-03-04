/***
 * Some utility functions for extracting information from a program
 *
 * to keep it simple its just one function for now, but these should be versioned / incorporated into parser later
 */

import {
  AtomicFunction,
  AuthorizationModeInfo,
  NonAtomicFunction,
} from "@valence-ui/generated-types/dist/server/types/ProgramConfigManager.types";
import {
  isPermissioned,
  isPermissionless,
  isPermissionWithLimit,
} from "@/app/programs/server";

export const getFunctionAddress = (
  func: AtomicFunction | NonAtomicFunction,
) => {
  if (!("|library_account_addr|" in func.contract_address))
    throw new Error("Function does not contain address");
  return func.contract_address["|library_account_addr|"];
};

export const getExecutionLimit = (
  authorizationMode: AuthorizationModeInfo,
  recieverAddress: string | null,
): string | null => {
  if (!recieverAddress) {
    return null;
  }
  if (isPermissionless(authorizationMode)) {
    return null;
  }
  if (isPermissioned(authorizationMode)) {
    if (isPermissionWithLimit(authorizationMode.permissioned)) {
      const limit = authorizationMode.permissioned.with_call_limit.find(
        ([originalReciever, _]) => originalReciever === recieverAddress,
      );

      return limit ? limit[1] : null;
    }
  }
  return null;
};
