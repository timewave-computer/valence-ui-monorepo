import {
  getAccountBalances,
  getProgram,
  TransformerOutput,
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
  // TODO: registry address should be passed here
  const _program = await getProgram(_programId);
  const {
    authorizationData,
    authorizations,
    programId,
    accounts,
    links,
    libraries,
  } = ConfigTransformer.transform(_program);

  const balances = await fetchBalances(accounts);

  const { edges, nodes } = NodeComposer.generate({
    program: {
      accounts,
      libraries,
      links,
    },
    accountBalances: balances,
  });

  /***
   * what to do tomorrow:
   * - factor out the error component and wrap exec in a try catch
   */
  // TODO: this should all be try/catch and return a readable error

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
        />
      </div>
    </div>
  );
}

const fetchBalances = async (accounts: TransformerOutput["accounts"]) => {
  const requests = Object.entries(accounts).map(async ([id, account]) => {
    if (!account.domain.CosmosCosmwasm) {
      throw new Error(
        `Non-cosmos domain ${JSON.stringify(account.domain)} not currently supported`,
      );
    }
    if (!account.addr) {
      // should not happen, just to make typescript happy
      throw new Error(`Account ${id} does not have an address`);
    }
    return {
      address: account.addr,
      balances: await getAccountBalances({
        chainName: account.domain.CosmosCosmwasm,
        accountAddress: account.addr,
      }),
    };
  });
  return Promise.all(requests);
};
