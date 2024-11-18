import { getProgram } from "@/app/programs/server";
import {
  AccountNode,
  LibraryNode,
  ProgramDiagramWithProvider,
} from "@/app/programs/ui";
import { ConfigTransformer } from "@/app/programs/server";

/***
 * Defined outside of rendering tree so it does not cause uneccessary rerenders
 *
 *  defined in server file and passed as prop because there is some issue with component imports if done from the client file
 */
const nodeTypes = {
  account: AccountNode,
  library: LibraryNode,
};

export default function ProgramPage({ params: { programId: _programId } }) {
  const program = getProgram(_programId);
  const { nodes, edges, authorizationData, authorizations, programId } =
    ConfigTransformer.transform(program);

  return (
    <div className="w-screen h-screen flex flex-col items-center ">
      {/* this div is the container for the diagram, needs to have defined height and width */}
      <div className="w-full h-full">
        <ProgramDiagramWithProvider
          edges={edges}
          nodes={nodes}
          nodeTypes={nodeTypes}
          authorizationData={authorizationData}
          authorizations={authorizations}
          programId={programId}
        />
      </div>
    </div>
  );
}
