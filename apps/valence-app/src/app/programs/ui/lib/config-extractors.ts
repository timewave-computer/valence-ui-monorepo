import { AuthorizationModeInfo, Subroutine } from "@valence-ui/generated-types";
import {
  isAtomicSubroutine,
  isNonAtomicSubroutine,
} from "@/app/programs/server";

export const isPermissionless = (authMode: AuthorizationModeInfo) => {
  if (typeof authMode === "string" && authMode === "permissionless") {
    return true;
  } else return false;
};

export const getSubroutineType = (
  subroutine: Subroutine,
): "atomic" | "nonatomic" => {
  if (isAtomicSubroutine(subroutine)) {
    return "atomic";
  } else if (isNonAtomicSubroutine(subroutine)) {
    return "nonatomic";
  } else throw new Error("Subroutine is neither atomic nor nonatomic");
};

export const getSubroutine = (subroutine: Subroutine) => {
  if (isAtomicSubroutine(subroutine)) {
    return subroutine.atomic;
  } else if (isNonAtomicSubroutine(subroutine)) {
    return subroutine.non_atomic;
  } else throw new Error("Subroutine neither atomic nor nonatomic");
};
