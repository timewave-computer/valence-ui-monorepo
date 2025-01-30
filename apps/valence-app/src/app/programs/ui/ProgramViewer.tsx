"use client";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import {
  AccountTable,
  ExecutionHistoryTable,
  ProcessorDisplay,
  RpcConfigForm,
  SubroutineDisplay,
  useProgramQuery,
  useInitializeLibrarySchemaCache,
  queryArgsAtom,
} from "@/app/programs/ui";
import { useInitializeMetadataCache } from "@/hooks";
import {
  Button,
  CalloutBox,
  Card,
  Heading,
  InfoText,
  LinkText,
  PrettyJson,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@valence-ui/ui-components";
import { Provider as JotaiProvider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import Link from "next/link";

export type ProgramViewerProps = {
  programId: string;
  data: GetProgramDataReturnValue;
};
function _ProgramViewer({ programId, data: _data }: ProgramViewerProps) {
  // page loads with initial server-fetched data. this inserts it into useQuery, so the access pattern is easy
  const { data, isFetching, isError } = useProgramQuery({
    programId,
    initialQueryData: _data,
  });

  useInitializeMetadataCache(data?.metadata ?? {});
  useInitializeLibrarySchemaCache(data?.librarySchemas ?? {});

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
        <div className="flex flex-row gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Raw Program</Button>
            </SheetTrigger>
            <SheetContent className="w-1/2" side="right">
              <Heading level="h2">Raw Program</Heading>
              <PrettyJson data={data?.rawProgram} />
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">RPC Settings</Button>
            </SheetTrigger>
            <SheetContent className="w-1/2" side="right">
              <Heading level="h2">RPC Settings</Heading>
              <RpcConfigForm />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isError || !data ? (
        <CalloutBox
          variant="error"
          className="my-4 w-full"
          title="Error fetching program"
        >
          Check RPC settings for each chain.
        </CalloutBox>
      ) : (
        <div className="grid grid-cols-5 w-full gap-4 pt-4 pb-4">
          <div className="flex flex-col col-span-3  gap-2">
            <Heading level="h2">Subroutines</Heading>
            <Card
              isLoading={isFetching}
              className="overflow-x-scroll flex-grow p-0  border-0 "
            >
              <SubroutineDisplay program={data} />
            </Card>
          </div>

          <div className="col-span-2 flex flex-col  gap-2">
            <Heading level="h2">Account Balances</Heading>
            <Card
              isLoading={isFetching}
              className="overflow-x-scroll flex-grow   p-2"
            >
              <AccountTable program={data} />
            </Card>
          </div>

          <div className="flex flex-col col-span-2  gap-2">
            <Heading level="h2">Processors</Heading>
            <Card
              isLoading={isFetching}
              className="overflow-x-scroll flex-grow p-0 "
            >
              <ProcessorDisplay program={data} />
            </Card>
          </div>
          <div className="flex flex-col col-span-3 flex-grow gap-2">
            <Heading level="h2">Execution History</Heading>
            <Card
              isLoading={isFetching}
              className="overflow-x-scroll flex-grow p-2  "
            >
              <ExecutionHistoryTable />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

const HydrateAtoms = ({ initialValues, children }) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues);
  return children;
};

export function ProgramViewer(props: ProgramViewerProps) {
  return (
    <JotaiProvider>
      <HydrateAtoms initialValues={[[queryArgsAtom, props.data?.queryConfig]]}>
        <_ProgramViewer {...props} />
      </HydrateAtoms>
    </JotaiProvider>
  );
}
