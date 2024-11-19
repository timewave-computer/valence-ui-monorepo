import {
  PrettyJson,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
} from "@valence-ui/ui-components";
import { TransformerOutput } from "@/app/programs/server";
import React from "react";

type SidePanelProps = Pick<
  TransformerOutput,
  "authorizationData" | "authorizations" | "programId"
> & {
  // add other things, if needed
};

export const DiagramSidePanelContent = ({
  authorizationData,
  authorizations,
  programId,
}: SidePanelProps) => {
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 5rem)",
      }}
      className="bg-valence-white w-96 h-full border border-valence-black flex flex-col overflow-y-scroll"
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
          <h1 className="font-semibold">Authorizations</h1>
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <div className="flex flex-col gap-2">
            {authorizations.map((auth) => (
              <PrettyJson key={`authorization-${auth.label}`} data={auth} />
            ))}
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
