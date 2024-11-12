"use client";
import {
  ReactFlow,
  Controls,
  Background,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export function ProgramDiagram({
  nodes,
  edges,
}: {
  edges: Edge[];
  nodes: Node[];
}) {
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
