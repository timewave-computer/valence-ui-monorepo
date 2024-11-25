import {
  PrettyJson,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
} from "@valence-ui/ui-components";
import { ProgramParserResult } from "@/app/programs/server";
import React, { useEffect, useRef, useState } from "react";
import { SortableTableHeader, TextCell, Label } from "@/components";
import {
  AtomicSubroutine,
  AuthorizationModeInfo,
  PermissionTypeInfo,
  Subroutine,
} from "@valence-ui/generated-types";
import { cn, displayAddress } from "@/utils";

type DiagramSidePanelProps = Pick<
  ProgramParserResult,
  "authorizationData" | "authorizations"
> & {
  selected: string[];
  select: (addressList: string[]) => void;
};

export const DiagramSidePanelContent = ({
  authorizationData,
  authorizations,
  select,
  selected,
}: DiagramSidePanelProps) => {
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 5rem)",
      }}
      className="bg-valence-white w-[440px] h-full border border-valence-black flex flex-col overflow-y-scroll"
    >
      <CollapsibleSectionRoot
        className="p-4 border-b border-valence-black"
        defaultIsOpen={true}
      >
        <CollapsibleSectionHeader className="flex flex-row w-full justify-between">
          <h1 className="font-semibold">Program Info</h1>
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <PrettyJson data={authorizationData} />
        </CollapsibleSectionContent>
      </CollapsibleSectionRoot>

      <CollapsibleSectionRoot
        className="p-4 border-b border-valence-black"
        defaultIsOpen={true}
      >
        <CollapsibleSectionHeader className="flex flex-row w-full justify-between ">
          <h1 className="font-semibold">Subroutines</h1>
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <div className="flex flex-col gap-6">
            {authorizations.map((auth) => {
              return (
                <AuthorizationData
                  select={select}
                  selected={selected}
                  key={`authorization-${auth.label}`}
                  authorization={auth}
                />
              );
            })}
          </div>
        </CollapsibleSectionContent>
      </CollapsibleSectionRoot>

      <CollapsibleSectionRoot className="p-4" defaultIsOpen={true}>
        <CollapsibleSectionHeader className="flex flex-row w-full justify-between">
          <h1 className="font-semibold">Processor</h1>
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <PrettyJson
            data={{
              address: authorizationData?.processor_addrs,
              isQueueEmpty: false,
              queue: [
                {
                  id: 0,
                  msgs: [],
                  retry: null,
                  subroutine: "{...}",
                },
              ],
              pendingPolytoneCallbacks: [],
            }}
          />
        </CollapsibleSectionContent>
      </CollapsibleSectionRoot>
    </div>
  );
};

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

export function isAtomic(obj: Subroutine): obj is {
  atomic: AtomicSubroutine;
} {
  return typeof obj === "object" && obj !== null && "atomic" in obj;
}

type Authorization = DiagramSidePanelProps["authorizations"][number];

const AtomicSubroutineData = ({
  subroutine,
}: {
  subroutine: AtomicSubroutine;
}) => {
  return (
    <div className="flex flex-col gap-1 pb-1 justify-start">
      <h2 className="text-xs font-semibold text-left">Functions</h2>

      {subroutine.functions.length === 0 ? (
        <span className="text-xxs font-mono text-left">
          No functions in subroutine
        </span>
      ) : (
        <>
          <div className="grid grid-cols-[3fr_1fr] overflow-x-auto border-x border-b border-valence-lightgray">
            {subroutineHeaders.map((header) => (
              <SortableTableHeader
                textClassName="font-semibold text-xs"
                buttonClassName="border-x  border-y-[1.6px] py-1 px-1.5 flex justify-center text-sm border border-valence-lightgray"
                key={`auth-table-header-cell-${header.label}`}
                label={header.label}
                ascending={true}
              />
            ))}

            {subroutine.functions.map((func, i) => {
              const { contract_address, domain, message_details } = func;
              const address = contract_address["|library_account_addr|"];

              return (
                <React.Fragment key={`subroutine-atomic-${address}`}>
                  <TextCell className="border border-b">
                    <PrettyJson data={message_details} />
                  </TextCell>
                  <TextCell className="border border-b">
                    {displayAddress(address)}
                  </TextCell>
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
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
function AuthorizationData({
  authorization,
  selected,
  select,
}: {
  authorization: Authorization;
  selected: string[];
  select: (addressList: string[]) => void;
}) {
  const { mode, label, subroutine, ...rest } = authorization;

  const atomicSubroutine = isAtomic(subroutine) ? subroutine.atomic : null;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const addressList = atomicSubroutine?.functions.map((func) => {
    return func.contract_address["|library_account_addr|" as string];
  });

  const isSelected =
    selected.length &&
    selected.sort().toString() === addressList?.sort().toString();

  return (
    <button
      ref={buttonRef}
      onClick={() => {
        if (isSelected) select([]);
        else select(addressList);
      }}
      className={cn(
        "overflow-x-scroll pl-4 border-l-4 hover:border-valence-blue transition-all ",
        isSelected && "border-valence-blue",
      )}
    >
      <div className="flex flex-row w-full justify-between gap-2 items-center pb-1">
        <h2 className="font-semibold">{label}</h2>
        <div className="flex flex-row gap-1 items-center">
          <Label className="" text={modeText(mode)} />
          {atomicSubroutine && <Label className="" text="atomic" />}
        </div>
      </div>

      {atomicSubroutine && (
        <AtomicSubroutineData subroutine={atomicSubroutine} />
      )}

      <div className="flex flex-col items-left">
        <h2 className="text-xs font-semibold text-left">Config</h2>
        <PrettyJson data={rest} />
      </div>
    </button>
  );
}
