import {
  AtomicSubroutine,
  AuthorizationModeInfo,
  NonAtomicSubroutine,
  ParamRestriction,
  PermissionTypeInfo,
  Subroutine,
  Uint128,
} from "@valence-ui/generated-types";

// Type guard for "permissionless"
export function isPermissionless(
  obj: AuthorizationModeInfo,
): obj is "permissionless" {
  return obj === "permissionless";
}

// Type guard for { permissioned: PermissionTypeInfo }
export function isPermissioned(
  obj: AuthorizationModeInfo,
): obj is { permissioned: PermissionTypeInfo } {
  return typeof obj === "object" && obj !== null && "permissioned" in obj;
}
export function isPermissionWithoutLimit(
  obj: PermissionTypeInfo,
): obj is { without_call_limit: string[] } {
  return typeof obj === "object" && obj !== null && "without_call_limit" in obj;
}
export function isPermissionWithLimit(obj: PermissionTypeInfo): obj is {
  with_call_limit: [string, Uint128][];
} {
  return typeof obj === "object" && obj !== null && "with_call_limit" in obj;
}

export function isAtomicSubroutine(obj: Subroutine): obj is {
  atomic: AtomicSubroutine;
} {
  return typeof obj === "object" && obj !== null && "atomic" in obj;
}

export function isNonAtomicSubroutine(obj: Subroutine): obj is {
  non_atomic: NonAtomicSubroutine;
} {
  return typeof obj === "object" && obj !== null && "non_atomic" in obj;
}

export function isMustBeIncludedParamRestriction(
  restriction: ParamRestriction,
) {
  return "must_be_included" in restriction;
}
export function isCannotBeIncludedParamRestriction(
  restriction: ParamRestriction,
) {
  return "cannot_be_included" in restriction;
}
export function isMustBeValueParamRestriction(restriction: ParamRestriction) {
  return "must_be_value" in restriction;
}
