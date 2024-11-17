import { IconButton, PrettyJson } from "@valence-ui/ui-components";
import { TransformerOutput } from "@/app/programs/server";
import { CgMathMinus, CgMaximizeAlt } from "react-icons/cg";
import React from "react";

type SidePanelProps = Pick<
  TransformerOutput,
  "authorizationData" | "authorizations"
> & {
  // add other things, if needed
};

export const DiagramSidePanelContent = ({
  authorizationData,
  authorizations,
}: SidePanelProps) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  return (
    <div className="bg-valence-white w-96 border valence-border-black p-4 flex flex-col gap-2">
      <div className="flex  justify-between">
        <h1 className="font-semibold">Authorizations</h1>
        <IconButton
          variant="sm"
          onClick={() => setIsMinimized(!isMinimized)}
          Icon={isMinimized ? CgMaximizeAlt : CgMathMinus}
        />
      </div>

      {!isMinimized && (
        <>
          <div>
            <h2 className="font-medium text-sm">Data</h2>
            <PrettyJson data={authorizationData} />
          </div>
          <div>
            <h2 className="font-medium text-sm">Subroutines</h2>
            <PrettyJson data={authorizations} />
          </div>
        </>
      )}
    </div>
  );
};
