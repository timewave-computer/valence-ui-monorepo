"use client";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import {
  AccountsTable,
  ExecutionHistoryTable,
  ProcessorDisplay,
  SubroutineDisplay,
  useProgramQuery,
  useInitializeLibrarySchemaCache,
  ProgramViewerErrorDisplay,
  ProgramRpcSettings,
  RefetchButton,
  useQueryArgs,
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

export type ProgramViewerProps = {
  programId: string;
  initialData: GetProgramDataReturnValue;
};
export function ProgramViewer({ programId, initialData }: ProgramViewerProps) {
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

  const { queryConfig, setQueryConfig } = useQueryArgs(initialData.queryConfig);

  useInitializeMetadataCache(data?.metadata ?? {});
  useInitializeLibrarySchemaCache(data?.librarySchemas ?? {});

  return (
    <div className="w-screen h-screen flex flex-col items-start p-4 ">
      <div className="flex flex-col  w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 flex-wrap">
            <LinkText
              href={`/programs?queryConfig=${JSON.stringify(queryConfig)}`}
              LinkComponent={Link}
              variant="breadcrumb"
            >
              Programs (alpha)
            </LinkText>
            <Heading level="h1"> / </Heading>
            <LinkText
              href={`/programs/${programId}`}
              LinkComponent={Link}
              variant="breadcrumb"
            >
              {programId}
            </LinkText>
          </div>
          <ProgramRpcSettings
            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}
          />
        </div>

        <ProgramViewerErrorDisplay errors={data?.errors} />
        <div className="flex flex-row gap-2 items-center justify-between pt-2">
          <div className="flex flex-row gap-2 items-center">
            <RefetchButton isFetching={isFetching} refetch={refetch} />
            {data?.rawProgram && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary">Raw Program</Button>
                </SheetTrigger>
                <SheetContent
                  title="Raw Program"
                  className="w-1/2"
                  side="right"
                >
                  <Heading level="h2">Raw Program</Heading>
                  <PrettyJson data={data?.rawProgram} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 w-full gap-4 pt-4 pb-4">
        <div className="flex flex-col col-span-2  gap-2">
          <Heading level="h2">Subroutines</Heading>
          <Card
            isLoading={isLoading}
            className="overflow-x-scroll flex-grow p-0  border-0 "
          >
            <SubroutineDisplay program={data} queryConfig={queryConfig} />
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
            <ProcessorDisplay program={data} queryConfig={queryConfig} />
          </Card>
        </div>
        <div className="flex flex-col col-span-2 flex-grow gap-2">
          <Heading level="h2">Execution History</Heading>
          <Card
            isLoading={isLoading}
            className="overflow-x-scroll  flex-grow p-2  "
          >
            <ExecutionHistoryTable program={data} />
          </Card>
        </div>
      </div>
    </div>
  );
}
