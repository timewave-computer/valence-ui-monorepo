import {
  getProgramData,
  GetProgramDataReturnValue,
} from "@/app/programs/server";
import { ProgramViewer } from "@/app/programs/ui";

export default async function ProgramPage({ params: { programId } }) {
  // on initial render, there is no query config supplied. it will be set from the UI
  // TODO: read query config from url search params
  const data = (await getProgramData({
    programId,
    throwError: true,
  })) as GetProgramDataReturnValue; // temp solution to handle function throwing error

  return <ProgramViewer programId={programId} data={data} />;
}
