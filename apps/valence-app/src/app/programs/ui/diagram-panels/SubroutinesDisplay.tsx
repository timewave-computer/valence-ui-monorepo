import {
  PrettyJson,
  Label,
  SortableTableHeader,
  TableCell,
} from "@valence-ui/ui-components";
import React, { useRef } from "react";
import { type AtomicSubroutine } from "@valence-ui/generated-types";
import { cn, displayAddress } from "@/utils";
import { type ProgramInfoProps, useDisplayStore } from "@/app/programs/ui";
import { useShallow } from "zustand/react/shallow";
import {
  getFunctionAddress,
  isAtomicSubroutine,
  isNonAtomicSubroutine,
  isPermissioned,
  isPermissionless,
} from "@/app/programs/server";

type Authorization = ProgramInfoProps["authorizations"][number];
export function SubroutinesDisplay({
  authorization,
}: {
  authorization: Authorization;
}) {
  const { mode, label, subroutine, ...rest } = authorization;
  const [selectedNodes, selectNodes] = useDisplayStore(
    useShallow((state) => [state.selectedAddresses, state.selectAddresses]),
  ); // useShallow prevents infinite loop

  const atomicSubroutine = isAtomicSubroutine(subroutine)
    ? subroutine.atomic
    : null;
  const nonAtomicSubroutine = isNonAtomicSubroutine(subroutine)
    ? subroutine.non_atomic
    : null;

  const buttonRef = useRef<HTMLButtonElement>(null);

  const addressList = isAtomicSubroutine(subroutine)
    ? subroutine.atomic.functions.map((func) => {
        return getFunctionAddress(func);
      })
    : subroutine.non_atomic.functions.map((func) => {
        return getFunctionAddress(func);
      });

  const isSubroutineSelected =
    selectedNodes.length &&
    selectedNodes.sort().toString() === addressList?.sort().toString();

  return (
    <button
      ref={buttonRef}
      onClick={() => {
        if (isSubroutineSelected) selectNodes([]);
        else selectNodes(addressList ?? []);
      }}
      className={cn(
        "overflow-x-scroll pl-4 border-l-4 hover:border-valence-blue transition-all ",
        isSubroutineSelected && "border-valence-blue",
      )}
    >
      <div className="flex flex-row w-full justify-between gap-2 items-center pb-1">
        <h2 className="font-semibold">{label}</h2>
        <div className="flex flex-row gap-1 items-center">
          <Label>{modeText(mode)}</Label>
          {atomicSubroutine && <Label>atomic</Label>}
        </div>
      </div>

      {atomicSubroutine && (
        <AtomicSubroutineDisplay subroutine={atomicSubroutine} />
      )}
      {nonAtomicSubroutine && (
        <span className="font-mono text-xs">
          Non-atomic subroutines not yet supported in UI.
        </span>
      )}

      <div className="flex flex-col items-left">
        <h2 className="text-xs font-semibold text-left">Config</h2>
        <PrettyJson data={rest} />
      </div>
    </button>
  );
}

const AtomicSubroutineDisplay = ({
  subroutine,
}: {
  subroutine: AtomicSubroutine;
}) => {
  return (
    <div className="flex flex-col gap-1 pb-1 justify-start">
      <h2 className="text-xs font-semibold text-left">Functions</h2>
      <div className="grid grid-cols-[3fr_1fr] overflow-x-auto border-x border-b border-valence-lightgray">
        {subroutineHeaders.map((header) => (
          <SortableTableHeader
            variant="secondary"
            key={`auth-table-header-cell-${header.label}`}
            label={header.label}
            ascending={true}
          />
        ))}

        {subroutine.functions.map((func, i) => {
          const address = getFunctionAddress(func);
          return (
            <React.Fragment key={`subroutine-atomic-${address}`}>
              <TableCell className="border border-b">
                <PrettyJson data={func.message_details} />
              </TableCell>
              <TableCell className="border border-b">
                {displayAddress(address)}
              </TableCell>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const modeText = (permission: Authorization["mode"]) => {
  if (isPermissionless(permission)) {
    return permission;
  } else if (isPermissioned(permission)) {
    return "with_call_limit" in permission.permissioned
      ? "Permissioned with limit"
      : "Permissioned without limit";
  } else return "";
};

const subroutineHeaders = [
  {
    label: "Message",
  },
  {
    label: "Address",
  },
];
