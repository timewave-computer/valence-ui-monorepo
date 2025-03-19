"use client";
import {
  GetProgramDataReturnValue,
  ProgramQueryConfig,
} from "@/app/programs/server";
import { DomainConnector } from "@/app/programs/ui";
import { Copyable, Heading } from "@valence-ui/ui-components";
import { displayAddress } from "@/utils";

export const ProgramMetdataDisplay = ({
  program,
  queryConfig,
}: {
  program?: GetProgramDataReturnValue;
  queryConfig: ProgramQueryConfig;
}) => {
  return (
    <div className="flex flex-col  md:grid grid-cols-4 w-full gap-2">
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
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 justify-items-start items-center">
            {
              <DomainConnector
                queryConfig={queryConfig}
                chainId={queryConfig.main.chainId}
                domainName={program.parsedProgram.domains.main}
              />
            }
            {program.parsedProgram.domains.external.map((domain) => {
              const chainId = queryConfig.external?.find(
                (chain) => chain.domainName === domain,
              )?.chainId;

              return (
                <DomainConnector
                  queryConfig={queryConfig}
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
