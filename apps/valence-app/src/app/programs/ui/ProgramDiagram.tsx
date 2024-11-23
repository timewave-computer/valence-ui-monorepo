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
import { useEffect, useState } from "react";
import {
  useAutoLayout,
  type DiagramLayoutAlgorithm,
  type Direction,
  DiagramSidePanelContent,
  DiagramTitle,
  ConnectionConfigPanel,
  ConnectionConfigFormValues,
} from "@/app/programs/ui";
import {
  type TransformerOutput,
  type NodeComposerReturnType,
} from "@/app/programs/server";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@valence-ui/ui-components";
import { RiSettings5Fill } from "react-icons/ri";

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
  queryConfig,
}: ProgramDiagramProps) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // every time  nodes change, center the graph
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);
  useAutoLayout(defaultDiagramLayoutOptions);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const mainChain = queryConfig.rpcs.find((rpc) => rpc.main);
  if (!mainChain) {
    throw new Error("No main chain ID found in rpc config");
  }

  // TODO: config panel submit should refetch data with new registryid and chain IDs
  // need to put data in useQuery

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
          <Dialog open={isSettingsOpen}>
            <IconButton
              onClick={() => {
                setIsSettingsOpen(true);
              }}
              Icon={RiSettings5Fill}
            />

            <DialogContent
              onEscapeKeyDown={() => {
                setIsSettingsOpen(false);
              }}
              onPointerDownOutside={() => {
                setIsSettingsOpen(false);
              }}
            >
              <DialogTitle className="text-lg font-bold">
                Connection Configuration
              </DialogTitle>
              {/* empty description, here to prevent warning */}
              <DialogDescription />
              <ConnectionConfigPanel
                defaultValues={{
                  registryAddress: queryConfig.registryAddress,
                  mainChainId: mainChain.chainId,
                  mainChainRpc: mainChain.rpc,
                  otherRpcs: queryConfig.rpcs
                    .filter((rpc) => rpc.chainId !== mainChain.chainId)
                    .map((rpc) => ({
                      chainId: rpc.chainId,
                      chainRpc: rpc.rpc,
                    })),
                }}
                onSubmit={(data: ConnectionConfigFormValues) => {
                  setIsSettingsOpen(false);
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
