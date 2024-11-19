import { getProgram } from "@/app/programs/server";
import {
  AccountNode,
  LibraryNode,
  ProgramDiagramWithProvider,
} from "@/app/programs/ui";
import { ConfigTransformer } from "@/app/programs/server";
import { RpcConfig } from "@/server/utils";
import { chains } from "chain-registry";

/***
 * Defined outside of rendering tree so it does not cause uneccessary rerenders
 *
 *  defined in server file and passed as prop because there is some issue with component imports if done from the client file
 */
const nodeTypes = {
  account: AccountNode,
  library: LibraryNode,
};

export default async function ProgramPage({
  params: { programId: _programId },
}) {
  const program = await getProgram(_programId);
  const balanceQueries = [];
  // Object.entries(program.accounts).forEach(([id, account]) => {

  //   if (!account.domain.CosmosCosmwasm) {
  //     throw new Error(`Non cosmos domains are not currently supported`);
  //   }
  //     const chainName = account.domain.CosmosCosmwasm;
  //     const chainId = chains.find(chain=>chain.chain_name===chainName)?.chain_id;
  //     if (!chainId) throw new Error(`Chain ${chainName} not found in registry`);
  //     const rpcUrl = RpcConfig[chainId].rpcUrl;

  //   return {
  //      chainId:account.domain,
  //       accountAddress:account.addr,
  //       rpcUrl: RpcConfig[chainId].rpcUrl
  //   }
  // })

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
