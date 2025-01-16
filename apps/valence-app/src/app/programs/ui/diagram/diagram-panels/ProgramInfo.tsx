import {
  PrettyJson,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
} from "@valence-ui/ui-components";
import { ProgramParserResult } from "@/app/programs/server";
import React from "react";
import { NAV_HEIGHT } from "@/components";
import { SubroutinesDisplay } from "./SubroutinesDisplay";

export type ProgramInfoProps = Pick<
  ProgramParserResult,
  "authorizationData" | "authorizations"
> & {};

export const ProgramInfo = ({
  authorizationData,
  authorizations,
}: ProgramInfoProps) => {
  return (
    <div
      style={{ maxHeight: `calc(100vh - ${NAV_HEIGHT})` }}
      className="bg-valence-white w-full border-l  border-valence-black flex flex-col overflow-y-scroll"
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
                <SubroutinesDisplay
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
