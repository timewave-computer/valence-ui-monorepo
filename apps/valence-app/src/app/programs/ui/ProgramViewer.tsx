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
  DEFAULT_QUERY_CONFIG,
  ProgramViewerErrorDisplay,
} from "@/app/programs/ui";
import { useInitializeMetadataCache } from "@/hooks";
import {
  Button,
  CalloutBox,
  Card,
  Heading,
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
  initialData: GetProgramDataReturnValue;
};
function ProgramViewer({ programId, initialData }: ProgramViewerProps) {
  // page loads with initial server-fetched data. this inserts it into useQuery, so the access pattern is easy
  const { data: data, isFetching } = useProgramQuery({
    programId,
    initialQueryData: initialData,
  });

  useInitializeMetadataCache(data?.metadata ?? {});
  useInitializeLibrarySchemaCache(data?.librarySchemas ?? {});

  return (
    <div className="w-screen h-screen flex flex-col items-start p-4 ">
      <div className="flex flex-col  w-full">
        <div className="flex flex-row gap-2">
          <LinkText href="/programs" LinkComponent={Link} variant="breadcrumb">
            Programs
          </LinkText>
          <Heading level="h1"> / </Heading>
          <Heading level="h1"> {programId} </Heading>
        </div>
        <ProgramViewerErrorDisplay errors={data?.errors} />
        <div className="flex flex-row gap-2 items-center pt-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">RPC Settings</Button>
            </SheetTrigger>
            <SheetContent title="RPC Settings" className="w-1/2" side="right">
              <Heading level="h2">RPC Settings</Heading>
              <RpcConfigForm />
            </SheetContent>
          </Sheet>
          {data?.rawProgram && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">Raw Program</Button>
              </SheetTrigger>
              <SheetContent title="Raw Program" className="w-1/2" side="right">
                <Heading level="h2">Raw Program</Heading>
                <PrettyJson data={data?.rawProgram} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
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
    </div>
  );
}

const HydrateAtoms = ({ initialValues, children }) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues);
  return children;
};

export function ProgramViewerWithProvider(props: ProgramViewerProps) {
  return (
    <JotaiProvider>
      <HydrateAtoms
        initialValues={[
          [
            queryArgsAtom,
            props.initialData?.queryConfig ?? DEFAULT_QUERY_CONFIG,
          ],
        ]}
      >
        <ProgramViewer {...props} />
      </HydrateAtoms>
    </JotaiProvider>
  );
}
