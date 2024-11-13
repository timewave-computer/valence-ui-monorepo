import {
  ReactFlow,
  Controls,
  Background,
  type Node,
  type Edge,
  type NodeTypes,
  useReactFlow,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  type MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import {
  useAutoLayout,
  type DiagramLayoutAlgorithm,
  type Direction,
} from "@/app/programs/ui";

type ProgramDiagramWithLayoutProps = {
  edges: Edge[];
  nodes: Node[];
  nodeTypes: NodeTypes;
};

const defaultDiagramLayoutOptions = {
  algorithm: "dagre" as DiagramLayoutAlgorithm,
  direction: "TB" as Direction,
  spacing: [40, 60] as [number, number],
};
const defaultEdgeOptions = {
  markerEnd: {
    type: "arrowclosed" as MarkerType,
    width: 16,
    height: 16,
  },
};

function ProgramDiagramWithLayout({
  nodes: initialNodes,
  edges: initialEdges,
  nodeTypes,
}: ProgramDiagramWithLayoutProps) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // every time  nodes change, center the graph
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);
  useAutoLayout(defaultDiagramLayoutOptions);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        onNodesChange={onNodesChange}
        fitView={true}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={defaultEdgeOptions}
        nodesDraggable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export function ProgramDiagram(props: ProgramDiagramWithLayoutProps) {
  return (
    <ReactFlowProvider>
      <ProgramDiagramWithLayout {...props} />
    </ReactFlowProvider>
  );
}
