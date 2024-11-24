import { getProgramData } from "@/app/programs/server-actions/get-program-data";
import {
  AccountNode,
  LibraryNode,
  ProgramDiagramWithProvider,
} from "@/app/programs/ui";

/***
 * Defined outside of rendering tree so it does not cause uneccessary rerenders
 *  defined in server file and passed as prop because there is some issue with component imports if done from the client file
 */
const nodeTypes = {
  account: AccountNode,
  library: LibraryNode,
};

export default async function ProgramPage({ params: { programId } }) {
  // on initial render, there is no query config supplied. it will be set from the UI
  // TODO: read query config from url search params
  const data = await getProgramData({ programId });

  return (
    <div className="w-screen h-screen flex flex-col items-center ">
      {/* this div is the container for the diagram, needs to have defined height and width */}
      <div className="w-full h-full">
        <ProgramDiagramWithProvider
          nodeTypes={nodeTypes}
          initialData={data}
          programId={programId}
        />
      </div>
    </div>
  );
}

export type RpcConfig = Record<string, string | undefined>;
