import {
  ReactFlow,
  Background,
  type NodeTypes,
  useReactFlow,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  type MarkerType,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import {
  useAutoLayout,
  type DiagramLayoutAlgorithm,
  type Direction,
  DiagramSidePanelContent,
  DiagramTitle,
} from "@/app/programs/ui";
import {
  type TransformerOutput,
  type NodeComposerReturnType,
} from "@/app/programs/server";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@valence-ui/ui-components";
import { RiSettings5Fill } from "react-icons/ri";
import { ConnectionConfigPanel } from "./ConnectionConfigPanel";

type ProgramDiagramProps = TransformerOutput &
  NodeComposerReturnType & {
    nodeTypes: NodeTypes;
  };

const defaultDiagramLayoutOptions = {
  algorithm: "dagre" as DiagramLayoutAlgorithm,
  direction: "TB" as Direction,
  spacing: [60, 60] as [number, number],
};
const defaultEdgeOptions = {
  markerEnd: {
    type: "arrowclosed" as MarkerType,
    width: 44,
    height: 36,
  },
};

function ProgramDiagram({
  nodes: initialNodes,
  edges: initialEdges,
  authorizationData,
  authorizations,
  nodeTypes,
  programId,
}: ProgramDiagramProps) {
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
        zoomOnDoubleClick={false}
      >
        <Background />
        <Panel position="bottom-left">
          <Dialog>
            <DialogTrigger>
              <IconButton Icon={RiSettings5Fill} />
            </DialogTrigger>
            <DialogContent>
              <ConnectionConfigPanel
                defaultValues={{
                  registryAddress: "0x123",
                  mainChainId: "neutron-1",
                  mainChainRpc: "https://neutron-1.valence.network",
                  rpcs: [
                    {
                      chainId: "neutron-1",
                      chainRpc: "https://neutron-1.valence.network",
                    },
                  ],
                }}
                onSubmit={() => {
                  console.log("submit");
                }}
              />
            </DialogContent>
          </Dialog>
        </Panel>
        <Panel position="top-left">
          <DiagramTitle programId={programId} />
        </Panel>
        <Panel position="top-right">
          <DiagramSidePanelContent
            programId={programId}
            authorizationData={authorizationData}
            authorizations={authorizations}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function ProgramDiagramWithProvider(props: ProgramDiagramProps) {
  return (
    <ReactFlowProvider>
      <ProgramDiagram {...props} />
    </ReactFlowProvider>
  );
}
