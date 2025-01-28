import {
  AtomicFunction,
  AuthorizationModeInfo,
  NonAtomicFunction,
  Subroutine,
} from "@valence-ui/generated-types";
import {
  isAtomicSubroutine,
  isNonAtomicSubroutine,
  NormalizedLibraries,
} from "@/app/programs/server";

export const isPermissionless = (authMode: AuthorizationModeInfo) => {
  if (typeof authMode === "string" && authMode === "permissionless") {
    return true;
  } else return false;
};

export const getSubroutineType = (
  subroutine: Subroutine,
): "atomic" | "non_atomic" => {
  if (isAtomicSubroutine(subroutine)) {
    return "atomic";
  } else if (isNonAtomicSubroutine(subroutine)) {
    return "non_atomic";
  } else throw new Error("Subroutine is neither atomic nor nonatomic");
};

export const getSubroutine = (subroutine: Subroutine) => {
  if (isAtomicSubroutine(subroutine)) {
    return subroutine.atomic;
  } else if (isNonAtomicSubroutine(subroutine)) {
    return subroutine.non_atomic;
  } else throw new Error("Subroutine neither atomic nor nonatomic");
};

// simpler to do it here than in parser. can move to parser in the future if needed
export const getFunctionLibraryAddress = (
  subroutineFunction: NonAtomicFunction | AtomicFunction,
) => {
  const address = subroutineFunction.contract_address["|library_account_addr|"];
  if (!address)
    throw new Error(
      `Unable to extract library address from function ${subroutineFunction.contract_address}`,
    );
  return address as string;
};

export const getLibraryConfigFromAddress = (
  address: string,
  libraries: NormalizedLibraries,
) => {
  const libraryConfig = Object.values(libraries).find((value) => {
    if (value.addr === address) return true;
  });
  return libraryConfig;
};
