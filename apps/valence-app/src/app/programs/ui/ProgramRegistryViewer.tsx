"use client";
import {
  Button,
  CellType,
  Heading,
  LinkText,
  PrettyJson,
  Table,
  TableColumnHeader,
} from "@valence-ui/ui-components";
import {
  ProgramRpcSettings,
  ProgramViewerErrorDisplay,
  RefetchButton,
  useGetAllProgramsInfiniteQuery,
  useGetAllProgramsQuery,
  useProgramQueryConfig,
} from "@/app/programs/ui";
import { CelatoneUrl, PublicProgramsConfig } from "@/const";
import Link from "next/link";
import {
  ExternalProgramQueryConfig,
  type GetAllProgramsReturnValue,
  ProgramQueryConfig,
} from "@/app/programs/server";
import { useEffect, useRef } from "react";

export const ProgramRegistryViewer = ({
  data: initialData,
}: {
  data: GetAllProgramsReturnValue;
}) => {
  const { queryConfig, setQueryConfig } = useProgramQueryConfig(
    initialData.queryConfig,
  );

  const infiniteQuery = useGetAllProgramsInfiniteQuery({
    initialQueryData: initialData,
    limit: 5,
  });

  const ids = infiniteQuery.data?.pages.map((page, i) => {
    return [i, ...(page.parsedPrograms?.map((program) => program.id) ?? [])];
  });

  const errorsFlat = infiniteQuery.data?.pages.flatMap((page) => {
    return page.errors;
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && infiniteQuery.hasNextPage) {
          infiniteQuery.fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [infiniteQuery.hasNextPage, infiniteQuery.fetchNextPage]);

  const mainQueryConfig = queryConfig.main;

  const flattenedData = infiniteQuery.data?.pages.flatMap((page) => {
    return page.parsedPrograms ?? [];
  });

  const tableData = flattenedData?.map(({ id, parsed, raw }) => {
    const authorizationsAddress = parsed.authorizationData?.authorization_addr;
    const externalDomains = parsed.domains.external;

    const externalDomainQueryConfig: ProgramQueryConfig["external"] =
      externalDomains
        ? externalDomains.reduce((acc, domain) => {
            const supportedChain =
              PublicProgramsConfig.getConfigByDomainName(domain);

            if (supportedChain) {
              acc.push({
                chainId: supportedChain.chainId,
                domainName: domain,
                chainName: supportedChain.chainName,
                rpc: supportedChain.rpc,
              });
            }
            return acc;
          }, [] as ExternalProgramQueryConfig)
        : null;

    const queryConfigForProgram: ProgramQueryConfig = {
      main: mainQueryConfig,
      external: externalDomainQueryConfig,
    };

    return {
      id: {
        value: id,
        link: {
          href: `/programs/${id}?queryConfig=${JSON.stringify(queryConfigForProgram)}`,
          LinkComponent: Link,
          blankTarget: false,
        },
      },
      name: {
        value: parsed.name ?? "-",
      },
      config: {
        link: "View config",
        body: (
          <>
            <Heading level="h2">Program {id}</Heading>
            <PrettyJson data={raw} />
          </>
        ),
      },
      authorizationsAddress: {
        value: authorizationsAddress ?? "-",

        link: {
          href: authorizationsAddress
            ? CelatoneUrl.contract(authorizationsAddress)
            : "",
        },
      },
      ownerAddress: {
        value: parsed.owner,
        link: {
          href: CelatoneUrl.account(parsed.owner),
        },
      },
      externalDomains: {
        value:
          parsed.domains.external.length > 0
            ? parsed.domains.external.join(", ")
            : "-",
      },
    };
  });

  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <div className="flex flex-row gap-2 items-center justify-between">
        <LinkText href={`/programs`} LinkComponent={Link} variant="breadcrumb">
          Programs (alpha)
        </LinkText>

        <ProgramRpcSettings
          initialQueryConfig={initialData.queryConfig}
          queryConfig={queryConfig}
          setQueryConfig={setQueryConfig}
        />
      </div>

      <ProgramViewerErrorDisplay errors={errorsFlat} />

      <div className="flex flex-row gap-2 w-full  justify-between pt-2">
        <RefetchButton
          isFetching={infiniteQuery.isFetching}
          refetch={infiniteQuery.refetch}
        />
      </div>

      <div className="flex flex-col  gap-2 pt-4 items-stretch overflow-clip">
        <Table
          className="overflow-scroll"
          loadingRows={20}
          isLoading={infiniteQuery.isLoading}
          variant="primary"
          headers={headers}
          data={tableData ?? []}
          isStreaming={
            infiniteQuery.isFetchingNextPage && !infiniteQuery.isRefetching
          }
        />
        {/* Observer div to detect scrolling */}
        {/* <div className=" pb-[200px]" ref={observerRef}>
                  observer ref
                </div> */}
      </div>
      <Button
        onClick={() => {
          infiniteQuery.fetchNextPage();
        }}
      >
        fetch more
      </Button>
    </main>
  );
};

const headers: TableColumnHeader[] = [
  {
    label: "Program ID",
    key: "id",
    cellType: CellType.Number,
  },
  {
    label: "Name",
    key: "name",
    cellType: CellType.Text,
  },
  {
    label: "External Domains",
    key: "externalDomains",
    cellType: CellType.Text,
  },
  {
    label: "Config",
    key: "config",
    cellType: CellType.Sheet,
  },
  {
    label: "Owner Address",
    key: "ownerAddress",
    cellType: CellType.Text,
  },
  {
    label: "Authorizations Address",
    key: "authorizationsAddress",
    cellType: CellType.Text,
  },
];
