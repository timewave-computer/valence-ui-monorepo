"use client";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import {
  AccountTable,
  ExecutionHistoryTable,
  ProcessorDisplay,
  SubroutineDisplay,
  useInitializeLibrarySchemaCache,
} from "@/app/programs/ui";
import { useInitializeMetadataCache } from "@/hooks";
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

export function ProgramViewer({
  programId,
  data,
}: {
  programId: string;
  data: GetProgramDataReturnValue;
}) {
  // page loads with initial server-fetched data. this inserts it into useQuery, so the access pattern is easy
  useInitializeMetadataCache(data.metadata);
  useInitializeLibrarySchemaCache(data.librarySchemas);

  return (
    <div className="w-screen h-screen flex flex-col items-start p-4 ">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <LinkText href="/programs" LinkComponent={Link} variant="breadcrumb">
            Programs
          </LinkText>
          <Heading level="h1"> / </Heading>
          <Heading level="h1"> {programId} </Heading>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" variant="secondary">
              View program config
            </Button>
          </SheetTrigger>
          <SheetContent className="w-1/2" side="right">
            <Heading level="h2">Raw Program Config</Heading>
            <PrettyJson data={data.rawProgram} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-5 w-full gap-4 pt-4 pb-4">
        <div className="flex flex-col col-span-3  gap-2">
          <Heading level="h2">Subroutines</Heading>
          <Card className="overflow-x-scroll flex-grow p-0  border-0 ">
            <SubroutineDisplay program={data} />
          </Card>
        </div>

        <div className="col-span-2 flex flex-col  gap-2">
          <Heading level="h2">Account Balances</Heading>
          <Card className="overflow-x-scroll flex-grow   p-2">
            <AccountTable program={data} />
          </Card>
        </div>

        <div className="flex flex-col col-span-2  gap-2">
          <Heading level="h2">Processors</Heading>
          <Card className="overflow-x-scroll flex-grow p-0 ">
            <ProcessorDisplay program={data} />
          </Card>
        </div>
        <div className="flex flex-col col-span-3 flex-grow gap-2">
          <Heading level="h2">Execution History</Heading>
          <Card className="overflow-x-scroll flex-grow p-2  ">
            <ExecutionHistoryTable />
          </Card>
        </div>
      </div>
    </div>
  );
}
