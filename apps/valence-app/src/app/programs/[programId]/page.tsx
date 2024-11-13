import { getProgram, managerConfigToDiagram } from "@/app/programs/server";
import { AccountNode, ProgramDiagram } from "@/app/programs/ui";

/***
 * Define outside of rendering tree so it does not cause uneccessary rerenders
 */
const nodeTypes = {
  account: AccountNode,
};

export default function ProgramPage({ params: { programId } }) {
  const program = getProgram(programId);
  const { nodes, edges } = managerConfigToDiagram(program);

  return (
    <div className="w-screen h-screen p-4 flex flex-col items-center ">
      {/* this div is the container for the diagram, needs to have defined height and width */}
      <div className="w-full h-full">
        <ProgramDiagram nodeTypes={nodeTypes} edges={edges} nodes={nodes} />
      </div>
    </div>
  );
}
