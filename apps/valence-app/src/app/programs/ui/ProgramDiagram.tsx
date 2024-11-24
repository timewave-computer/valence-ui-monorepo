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
  createQueryArgsStore,
  ProgramQueryArgsContext,
  useProgramQuery,
} from "@/app/programs/ui";
import {
  type ProgramParserResult,
  type NodeComposerReturnType,
  QueryConfig,
} from "@/app/programs/server";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@valence-ui/ui-components";
import { RiSettings5Fill } from "react-icons/ri";

import { useRef } from "react";

export type ProgramDiagramProps = {
  initialData: ProgramParserResult & NodeComposerReturnType;
  queryConfig: QueryConfig;
  nodeTypes: NodeTypes;
  programId: string;
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
  initialData,
  programId,
  nodeTypes,
  queryConfig,
}: ProgramDiagramProps) {
  const { fitView } = useReactFlow();
  const {
    nodes: initialNodes,
    edges: initialEdges,
    authorizationData,
    authorizations,
  } = initialData;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // TODO: subscribe to store to prevent rerenders
  // const scratchRef = useRef(useScratchStore.getState().scratches)
  // // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  // useEffect(() => useScratchStore.subscribe(
  //   state => (scratchRef.current = state.scratches)
  // ), [])

  /***
   * initial args are supplied in context provider higher in the tree
   *  this is the recommended way to create a store with initialized props
   *  https://zustand.docs.pmnd.rs/guides/initialize-state-with-props#initialize-state-with-props
   */

  useProgramQuery({
    initialData,
  });

  // every time  nodes change, center the graph
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);
  useAutoLayout(defaultDiagramLayoutOptions);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
                  registryAddress: queryConfig.main.registryAddress,
                  mainChainId: queryConfig.main.chainId,
                  mainChainRpc: queryConfig.main.rpc,
                  otherRpcs: queryConfig.allChains
                    .filter((rpc) => rpc.chainId !== queryConfig.main.chainId)
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
  const queryArgsStore = useRef(
    createQueryArgsStore(props.queryConfig),
  ).current;

  return (
    <ProgramQueryArgsContext.Provider value={queryArgsStore}>
      <ReactFlowProvider>
        <ProgramDiagram {...props} />
      </ReactFlowProvider>
    </ProgramQueryArgsContext.Provider>
  );
}
