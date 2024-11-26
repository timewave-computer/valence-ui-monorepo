/***
 * Some utility functions for extracting information from a program
 *
 * to keep it simple its just one function for now, but these should be versioned / incorporated into parser later
 */

import {
  AtomicFunction,
  NonAtomicFunction,
} from "@valence-ui/generated-types/dist/server/types/ProgramConfigManager.types";

export const getFunctionAddress = (
  func: AtomicFunction | NonAtomicFunction,
) => {
  if (!("|library_account_addr|" in func.contract_address))
    throw new Error("Function does not contain address");
  return func.contract_address["|library_account_addr|"];
};
