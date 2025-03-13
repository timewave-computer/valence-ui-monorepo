import { Card } from "@valence-ui/ui-components";
import {
  type GetProgramDataReturnValue,
  type QueryConfig,
} from "@/app/programs/server";
import { ProcessorSection } from "@/app/programs/ui";

export const ProcessorDisplay = ({
  program,
  queryConfig,
}: {
  program?: GetProgramDataReturnValue;
  queryConfig: QueryConfig;
}) => {
  const processorData =
    program?.parsedProgram?.authorizationData.processorData ?? {};
  const processors = Object.entries(processorData);

  if (!processors.length) {
    return (
      <Card className="grow h-full border-0">No processors to display.</Card>
    );
  }

  return processors.map(([domain, processorData]) => {
    const processorQueue = program?.processorQueues?.find(
      (q) => q.processorAddress === processorData.address,
    );

    return (
      <ProcessorSection
        chainIds={program?.chainIds ?? []}
        key={`processor-table-${processorData.address}`}
        processorQueue={processorQueue}
        processorData={processorData}
        domain={domain}
        queryConfig={queryConfig}
      />
    );
  });
};
