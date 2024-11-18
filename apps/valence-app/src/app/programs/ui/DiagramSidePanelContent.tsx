import {
  PrettyJson,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
} from "@valence-ui/ui-components";
import { TransformerOutput } from "@/app/programs/server";
import { CgMathMinus, CgMaximizeAlt } from "react-icons/cg";
import React from "react";
import { FaChevronLeft, FaChevronDown } from "react-icons/fa";
import { set } from "lodash";
import {} from "@/components";

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
    <div className="bg-valence-white w-96 border border-valence-black flex flex-col">
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

      <CollapsibleSectionRoot className="p-4" defaultIsOpen={true}>
        <CollapsibleSectionHeader className="flex flex-row w-full justify-between">
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
    </div>
  );
};
