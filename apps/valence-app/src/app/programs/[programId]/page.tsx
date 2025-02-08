import {
  getProgramData,
  GetProgramDataReturnValue,
} from "@/app/programs/server";
import { ProgramViewerWithStateProvider } from "@/app/programs/ui";
import { JSX } from "react";

interface PageProps {
  params: Promise<{
    programId: string;
  }>;
}
export default async function ProgramPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { programId } = await params;

  // on initial render, there is no query config supplied. it will be set from the UI
  // TODO: read query config from url search params
  const data = (await getProgramData({
    programId,
  })) as GetProgramDataReturnValue;

  return (
    <ProgramViewerWithStateProvider programId={programId} initialData={data} />
  );
}
