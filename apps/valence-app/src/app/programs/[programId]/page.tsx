import {
  fetchAccountBalances,
  fetchProgram,
  TransformerOutput,
  defaultQueryConfig,
} from "@/app/programs/server";
import {
  AccountNode,
  LibraryNode,
  ProgramDiagramWithProvider,
} from "@/app/programs/ui";
import { ConfigTransformer, NodeComposer } from "@/app/programs/server";

/***
 * Defined outside of rendering tree so it does not cause uneccessary rerenders
 *  defined in server file and passed as prop because there is some issue with component imports if done from the client file
 */
const nodeTypes = {
  account: AccountNode,
  library: LibraryNode,
};

export default async function ProgramPage({
  params: { programId: _programId },
}) {
  const _program = await fetchProgram({
    programId: _programId,
    registryAddress: defaultQueryConfig.registryAddress,
  });
  const {
    authorizationData,
    authorizations,
    programId,
    accounts,
    links,
    libraries,
    queryConfig,
  } = ConfigTransformer.transform(_program);

  const balances = await queryAccountBalances(accounts, queryConfig);

  const { edges, nodes } = NodeComposer.generate({
    program: {
      accounts,
      libraries,
      links,
    },
    accountBalances: balances,
  });

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
          accounts={accounts}
          links={links}
          libraries={libraries}
          queryConfig={queryConfig}
        />
      </div>
    </div>
  );
}

export type RpcConfig = Record<string, string | undefined>;

const queryAccountBalances = async (
  accounts: TransformerOutput["accounts"],
  config: TransformerOutput["queryConfig"],
) => {
  const requests = Object.entries(accounts).map(async ([id, account]) => {
    if (!account.addr) {
      // should not happen, just to make typescript happy
      throw new Error(`Account ${id} does not have an address`);
    }

    const rpcUrl = config.rpcs.find(
      (rpc) => rpc.chainId === account.chainId,
    )?.rpc;
    if (!rpcUrl) {
      throw new Error(`No RPC URL found for chain ID ${account.chainId}`);
    }

    const balances = await fetchAccountBalances({
      accountAddress: account.addr,
      rpcUrl,
    });

    return {
      address: account.addr,
      balances,
    };
  });
  return Promise.all(requests);
};
