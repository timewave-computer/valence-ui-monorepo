import {
  getProgramData,
  GetProgramDataReturnValue,
} from "@/app/programs/server";
import {
  AccountTable,
  ExecutionHistoryTable,
  ProcessorDisplay,
  SubroutineDisplay,
} from "@/app/programs/ui";
import {
  Button,
  Card,
  Heading,
  LinkText,
  PrettyJson,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@valence-ui/ui-components";
import Link from "next/link";

export default async function ProgramPage({ params: { programId } }) {
  // on initial render, there is no query config supplied. it will be set from the UI
  // TODO: read query config from url search params
  const data = (await getProgramData({
    programId,
    throwError: true,
  })) as GetProgramDataReturnValue; // temp solution to handle function throwing error

  return (
    <div className="w-screen h-screen flex flex-col items-start p-4 ">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <LinkText href="/programs" LinkComponent={Link} variant="breadcrumb">
            Programs
          </LinkText>
          <Heading level="h5"> / </Heading>
          <Heading level="h5"> {programId} </Heading>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">View Raw Config</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <Heading level="h5">Raw Program Config</Heading>
            <PrettyJson data={data.rawProgram} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-row gap-4 w-full pt-4">
        <div className="flex flex-col w-3/5 flex-grow gap-2">
          <Heading level="h5">Subroutines</Heading>
          <Card className="overflow-x-scroll flex-grow p-0  border-0 ">
            <SubroutineDisplay program={data} />
          </Card>
        </div>
        <div className="w-2/5 flex flex-col  flex-grow gap-2">
          <Heading level="h5">Accounts</Heading>
          <Card className="overflow-x-scroll flex-grow   p-2">
            <AccountTable program={data} />
          </Card>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full pt-4">
        <div className="flex flex-col w-2/5 flex-grow gap-2">
          <Heading level="h5">Processors</Heading>
          <Card className="overflow-x-scroll flex-grow p-0 ">
            <ProcessorDisplay program={data} />
          </Card>
        </div>
        <div className="flex flex-col w-3/5 flex-grow gap-2">
          <Heading level="h5">Execution History</Heading>
          <Card className="overflow-x-scroll flex-grow p-2  ">
            <ExecutionHistoryTable />
          </Card>
        </div>
      </div>
    </div>
  );
}
