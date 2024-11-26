import {
  AtomicSubroutine,
  AuthorizationModeInfo,
  NonAtomicSubroutine,
  PermissionTypeInfo,
  Subroutine,
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
