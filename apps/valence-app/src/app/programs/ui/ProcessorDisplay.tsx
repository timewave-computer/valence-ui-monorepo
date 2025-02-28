import { Card } from "@valence-ui/ui-components";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import { ProcessorSection } from "@/app/programs/ui";

export const ProcessorDisplay = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
  const processorAddresses =
    program?.parsedProgram?.authorizationData?.processor_addrs;
  let processors = Array<[string, string]>();
  if (processorAddresses) {
    processors = Object.entries(processorAddresses);
  }

  if (!processors.length) {
    return (
      <Card className="grow h-full border-0">No processors to display.</Card>
    );
  }

  return processors.map(([domain, processorAddress]) => {
    const processorData = program?.processorQueues?.find(
      (q) => q.processorAddress === processorAddress,
    );

    return (
      <ProcessorSection
        key={`processor-table-${processorAddress}`}
        processorData={processorData}
        processorAddress={processorAddress}
        domain={domain}
      />
    );
  });
};
