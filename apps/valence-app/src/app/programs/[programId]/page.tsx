import {
  getProgramData,
  GetProgramDataReturnValue,
} from "@/app/programs/server";
import { ProgramDiagramWithProvider } from "@/app/programs/ui";

export default async function ProgramPage({ params: { programId } }) {
  // on initial render, there is no query config supplied. it will be set from the UI
  // TODO: read query config from url search params
  const data = (await getProgramData({
    programId,
    throwError: true,
  })) as GetProgramDataReturnValue; // temp solution to handle function throwing error

  return (
    <div className="w-screen h-screen flex flex-col items-center ">
      {/* this div is the container for the diagram, needs to have defined height and width */}
      <div className="w-full h-full">
        <ProgramDiagramWithProvider initialData={data} programId={programId} />
      </div>
    </div>
  );
}
