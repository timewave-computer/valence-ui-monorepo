"use client";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import {
  AccountsTable,
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
import { HydrateAtoms } from "@/components";
import { useInitializeMetadataCache } from "@/hooks";
import { LOCAL_DEV_DOC_URL } from "@valence-ui/socials";
import {
  Button,
  Card,
  cn,
  Heading,
  LinkText,
  PrettyJson,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@valence-ui/ui-components";
import { Provider as JotaiProvider } from "jotai";
import Link from "next/link";
import { BiRefresh } from "react-icons/bi";

export type ProgramViewerProps = {
  programId: string;
  initialData: GetProgramDataReturnValue;
};
function ProgramViewer({ programId, initialData }: ProgramViewerProps) {
  // page loads with initial server-fetched data. this inserts it into useQuery, so the access pattern is easy
  const {
    data: data,
    isLoading,
    refetch,
    isFetching,
  } = useProgramQuery({
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
          <Button
            className="min-w-0"
            variant={"secondary"}
            onClick={() => refetch()}
            disabled={isFetching}
            iconClassName={cn("w-5 h-5", isFetching && "animate-spin")}
            SuffixIcon={BiRefresh}
          ></Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">RPC Settings</Button>
            </SheetTrigger>
            <SheetContent title="RPC Settings" className="w-1/2" side="right">
              <Heading level="h2">RPC Settings</Heading>
              <div>
                <p className="text-sm">
                  The programs UI can connect to any public RPC endpoint.
                </p>
                <LinkText
                  blankTarget={true}
                  href={LOCAL_DEV_DOC_URL}
                  className="text-sm"
                  variant="highlighted"
                >
                  Learn how to use this UI with local development.
                </LinkText>
              </div>

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
      <div className="grid grid-cols-4 w-full gap-4 pt-4 pb-4">
        <div className="flex flex-col col-span-2  gap-2">
          <Heading level="h2">Subroutines</Heading>
          <Card
            isLoading={isLoading}
            className="overflow-x-scroll flex-grow p-0  border-0 "
          >
            <SubroutineDisplay program={data} />
          </Card>
        </div>

        <div className="col-span-2 flex flex-col  gap-2">
          <Heading level="h2">Accounts</Heading>
          <Card
            isLoading={isLoading}
            className="overflow-x-scroll flex-grow p-2"
          >
            <AccountsTable program={data} />
          </Card>
        </div>

        <div className="flex flex-col col-span-2  gap-2">
          <Heading level="h2">Processors</Heading>
          <Card
            isLoading={isLoading}
            className="overflow-x-scroll flex-grow p-0 "
          >
            <ProcessorDisplay program={data} />
          </Card>
        </div>
        <div className="flex flex-col col-span-2 flex-grow gap-2">
          <Heading level="h2">Execution History</Heading>
          <Card
            isLoading={isLoading}
            className="overflow-x-scroll flex-grow p-2  "
          >
            <ExecutionHistoryTable />
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ProgramViewerWithStateProvider(
  props: React.ComponentProps<typeof ProgramViewer>,
) {
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
