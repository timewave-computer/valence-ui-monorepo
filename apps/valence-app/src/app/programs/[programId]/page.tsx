"use client";
import {
  getProgram,
  makeNodesAndEdges,
  AccountNode,
  ProgramDiagram,
} from "@/app/programs";

/***
 * Define outside of rendering tree so it does not cause uneccessary rerenders
 */
const nodeTypes = {
  account: AccountNode,
};

export default function ProgramPage({ params: { programId } }) {
  const program = getProgram(programId);
  const { nodes, edges } = makeNodesAndEdges(program);

  console.log("nodes n edges in server", nodes.length, edges.length);

  return (
    <div className="w-screen h-screen p-4 flex flex-col items-center ">
      {/* this div is the container for the diagram, needs to have defined height and width */}
      <div className="w-full h-full">
        <ProgramDiagram nodeTypes={nodeTypes} edges={edges} nodes={nodes} />
      </div>
    </div>
  );
}
