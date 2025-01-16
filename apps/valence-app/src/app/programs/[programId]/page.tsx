import {
  getProgramData,
  GetProgramDataReturnValue,
} from "@/app/programs/server";
import { ProgramDiagramWithProvider } from "@/app/programs/ui";
import { Heading, LinkText } from "@valence-ui/ui-components";
import Link from "next/link";

export default async function ProgramPage({ params: { programId } }) {
  // on initial render, there is no query config supplied. it will be set from the UI
  // TODO: read query config from url search params
  // const data = (await getProgramData({
  //   programId,
  //   throwError: true,
  // })) as GetProgramDataReturnValue; // temp solution to handle function throwing error

  return (
    <div className="w-screen h-screen flex flex-col items-start p-4 ">
      <div className="flex flex-row gap-2">
        <LinkText href="/programs" LinkComponent={Link} variant="breadcrumb">
          Programs
        </LinkText>
        <Heading level="h4"> / </Heading>
        <Heading level="h4"> {programId} </Heading>
      </div>

      {/* this div is the container for the diagram, needs to have defined height and width */}
      <div className="w-full h-full">
        {/* <ProgramDiagramWithProvider initialData={data} programId={programId} /> */}
      </div>
    </div>
  );
}
