import {
  GetProgramDataReturnValue,
  ProgramQueryConfig,
} from "@/app/programs/server";
import {
  Button,
  Copyable,
  Heading,
  Label,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import { useAccount, useConnect } from "graz";
import { supportedProgramsChains } from "@/context";
import { displayAddress } from "@/utils";

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
    <div className="grid grid-cols-4 w-full gap-x-2">
      <div className="">
        <Heading level="h4">Owner</Heading>
        <Copyable copyText={program?.parsedProgram?.owner ?? ""}>
          <div className="text-xs font-mono">
            {displayAddress(program?.parsedProgram?.owner ?? "")}
          </div>
        </Copyable>
      </div>

      <div className="">
        <Heading level="h4">Authorizations Contract</Heading>
        <Copyable
          copyText={
            program?.parsedProgram?.authorizationData?.authorization_addr ?? ""
          }
        >
          <div className="text-xs font-mono">
            {displayAddress(
              program?.parsedProgram?.authorizationData?.authorization_addr ??
                "",
            )}
          </div>
        </Copyable>
      </div>
      <div>
        <Heading level="h4">Domains</Heading>

        {program?.parsedProgram?.domains && (
          <div className="grid grid-cols-2 w-fit gap-y-1 gap-x-2 justify-items-start align-items-center">
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
      <div className="text-xs font-mono">
        {domainName} ({chainId ?? "-"})
      </div>
      <div className="text-xs">
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
