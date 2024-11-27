import {
  ReactFlow,
  Background,
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
  ProgramInfo,
  DiagramTitle,
  RpcSettingsPanel,
  RpcSettingsFormValues,
  createQueryArgsStore,
  ProgramQueryArgsContext,
  useProgramQuery,
  useQueryArgsStore,
  QueryArgsStore,
  useDisplayStore,
} from "@/app/programs/ui";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  cn,
} from "@valence-ui/ui-components";
import { RiSettings5Fill, RiRefreshLine } from "react-icons/ri";
import { useRef } from "react";
import {
  GetProgramDataReturnValue,
  isLibraryNode,
  nodeTypes,
} from "@/app/programs/server";
import { useShallow } from "zustand/react/shallow";

export type ProgramDiagramProps = {
  initialData: GetProgramDataReturnValue;
  programId: string;
};

function ProgramDiagram({ initialData, programId }: ProgramDiagramProps) {
  const { fitView } = useReactFlow();
  const {
    nodes: initialNodes,
    edges: initialEdges,
    authorizationData,
    authorizations,
  } = initialData;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /***
   * initial args are supplied in context provider higher in the tree
   *  this is the recommended way to create a store with initialized props
   *  https://zustand.docs.pmnd.rs/guides/initialize-state-with-props#initialize-state-with-props
   */

  const { queryConfig, setQueryConfig } = useQueryArgsStore();

  const [selectedNodes] = useDisplayStore(
    useShallow((state) => [state.selectedAddresses]),
  ); // useShallow prevents infinite loop

  const displaySelectedNodes = (addresses: string[]) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (!isLibraryNode(node)) {
          return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            selected: addresses.includes(node.data.address) ? true : false,
          },
        };
      }),
    );
  };

  useEffect(() => {
    displaySelectedNodes(selectedNodes);
  }, [selectedNodes]);

  const { refetch: refetchProgram, isFetching: isProgramFetching } =
    useProgramQuery({
      programId,
      initialQueryData: initialData,
    });

  // every time  nodes change, center the graph
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);
  useAutoLayout(defaultDiagramLayoutOptions);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleUpdateQueryConfig = (data: RpcSettingsFormValues) => {
    console.log("data", data);
    setQueryConfig({
      main: data.main,
      allChains: [
        {
          chainId: data.main.chainId,
          rpc: data.main.rpc,
          name: data.main.name,
          crosschain: false,
        },
        ...data.otherChains.map((chain) => ({
          chainId: chain.chainId,
          rpc: chain.rpc,
          name: chain.name,
          crosschain: true,
        })),
      ],
    });
  };

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
            <div className="flex flex-col gap-1">
              <IconButton
                className={cn(isProgramFetching && "animate-spin")}
                onClick={() => {
                  refetchProgram();
                }}
                Icon={RiRefreshLine}
              />
              <IconButton
                onClick={() => {
                  setIsSettingsOpen(true);
                }}
                Icon={RiSettings5Fill}
              />
            </div>

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
              <RpcSettingsPanel
                defaultValues={{
                  main: queryConfig.main,
                  otherChains: queryConfig.allChains
                    .filter(
                      (chain) => chain.chainId !== queryConfig.main.chainId,
                    )
                    .map((chain) => ({
                      chainId: chain.chainId,
                      rpc: chain.rpc,
                      name: chain.name,
                    })),
                }}
                onSubmit={(data: RpcSettingsFormValues) => {
                  setIsSettingsOpen(false);
                  handleUpdateQueryConfig(data);
                }}
              />
            </DialogContent>
          </Dialog>
        </Panel>
        <Panel position="top-left">
          <DiagramTitle programId={programId} />
        </Panel>
        <Panel position="top-right">
          <ProgramInfo
            authorizationData={authorizationData}
            authorizations={authorizations}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function ProgramDiagramWithProvider(props: ProgramDiagramProps) {
  const store = useRef<QueryArgsStore>();
  if (!store.current) {
    store.current = createQueryArgsStore({
      queryConfig: props.initialData.queryConfig,
    });
  }

  console.log("initial config", props.initialData.queryConfig);

  return (
    <ProgramQueryArgsContext.Provider value={store.current}>
      <ReactFlowProvider>
        <ProgramDiagram {...props} />
      </ReactFlowProvider>
    </ProgramQueryArgsContext.Provider>
  );
}

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
