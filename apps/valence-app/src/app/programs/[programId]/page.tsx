import {
  getProgramData,
  GetProgramDataReturnValue,
  loadQueryConfigSearchParams,
} from "@/app/programs/server";
import { ProgramViewer, SuspenseLoadingSkeleton } from "@/app/programs/ui";
import { ABSOLUTE_URL, PROGRAMS_DESCRIPTION } from "@/const";
import { X_HANDLE } from "@valence-ui/socials";
import { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 60;

export async function generateMetadata({ params }: ProgramPageProps) {
  const { programId } = params;

  const metadata: Metadata = {
    title: `Valence Program ${programId}`,
    description: PROGRAMS_DESCRIPTION,
    openGraph: {
      siteName: "Valence",
      description: PROGRAMS_DESCRIPTION,
      url: `${ABSOLUTE_URL}/programs/${programId}`,
      images: ["/img/opengraph/programs-og.png"],
    },
    twitter: {
      creator: X_HANDLE,
      card: "summary",
      images: ["/img/opengraph/programs-og.png"],
      description: PROGRAMS_DESCRIPTION,
    },
  };

  return metadata;
}

interface ProgramPageProps {
  params: { programId: string };
  searchParams: Promise<Record<string, string>>;
}

export default async function ProgramPage(props: ProgramPageProps) {
  return (
    <Suspense fallback={<SuspenseLoadingSkeleton />}>
      <ProgramViewerLoader {...props} />
    </Suspense>
  );
}

async function ProgramViewerLoader({
  params: { programId },
  searchParams: _searchParams,
}: ProgramPageProps) {
  const searchParams = await _searchParams;

  const { queryConfig: parsedQueryConfig } = loadQueryConfigSearchParams(
    searchParams.queryConfig,
  );

  const data = (await getProgramData({
    programId,
    queryConfig: parsedQueryConfig ?? undefined,
  })) as GetProgramDataReturnValue;

  return <ProgramViewer programId={programId} initialData={data} />;
}
