import {
  GetProgramDataReturnValue,
  ProgramQueryConfig,
} from "@/app/programs/server";
import {
  Button,
  Heading,
  Label,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import { useAccount, useConnect } from "graz";
import { supportedProgramsChains } from "@/context";

export const ProgramMetdataDisplay = ({
  program,
  queryConfig,
}: {
  program?: GetProgramDataReturnValue;
  queryConfig: ProgramQueryConfig;
}) => {
  const { data: accounts } = useAccount({
    multiChain: true,
  });

  return (
    <div className="flex flex-col gap-2">
      <Heading level="h3">Domains</Heading>
      {program?.parsedProgram?.domains && (
        <div className="grid grid-cols-3 w-fit gap-y-4 gap-x-2 justify-items-start align-items-center">
          {
            <DomainDisplay
              chainId={queryConfig.main.chainId}
              domainName={program.parsedProgram.domains.main}
            />
          }
          {program.parsedProgram.domains.external.map((domain) => {
            const chainId = queryConfig.external?.find(
              (chain) => chain.domainName === domain,
            )?.chainId;
            return (
              <DomainDisplay
                key={`metadata-domain-${domain}`}
                domainName={domain}
                chainId={chainId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const DomainDisplay = ({
  domainName,
  chainId,
}: {
  domainName: string;
  chainId?: string;
}) => {
  const { data: account } = useAccount({
    chainId,
  });
  const { connect } = useConnect();

  const handleConnect = () => {
    try {
      if (!chainId) {
        throw new Error(
          `Chain ID missing for domain ${domainName}. Check RPC settings.`,
        );
      }
      connect({
        chainId,
      });
    } catch (error) {
      toast.error(
        <ToastMessage variant="error" title="Failed to connect">
          {error.message}
        </ToastMessage>,
      );
      console.log(error);
    }
  };

  return (
    <>
      <Heading level="h4">{domainName}</Heading>
      <div className="text-sm font-mono">{chainId ?? "-"}</div>
      <div className="text-sm">
        {account ? (
          <Label variant="green">Connected</Label>
        ) : (
          <Button
            className="w-full"
            onClick={handleConnect}
            size="sm"
            variant="secondary"
          >
            Connect
          </Button>
        )}
      </div>
    </>
  );
};
