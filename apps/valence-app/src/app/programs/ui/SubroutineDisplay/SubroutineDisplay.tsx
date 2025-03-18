"use client";
import {
  isPermissionless,
  type GetProgramDataReturnValue,
  getExecutionLimit,
  type ProgramQueryConfig,
} from "@/app/programs/server";
import {
  Card,
  cn,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Heading,
  Label,
} from "@valence-ui/ui-components";
import {
  displayAuthMode,
  displaySubroutineType,
  ExecutableSubroutine,
  getSubroutine,
  permissionFactoryDenom,
  PermissionsDisplay,
} from "@/app/programs/ui";
import { useWalletBalancesV2 } from "@/hooks";
import { useAccount } from "graz";

export const SubroutineDisplay = ({
  program,
  queryConfig,
}: {
  program?: GetProgramDataReturnValue;
  queryConfig: ProgramQueryConfig;
}) => {
  const { data: account } = useAccount();
  const walletAddress = account?.bech32Address;

  const { data: balances, isLoading: isLoadingBalances } = useWalletBalancesV2({
    rpcUrl: queryConfig?.main?.rpc,
    address: walletAddress,
  });

  const authorizations = program?.parsedProgram?.authorizations;
  const authorizationsAddress =
    program?.parsedProgram?.authorizationData?.authorization_addr ?? "";
  if (!authorizations)
    return <Card className="grow h-full">No subroutines to display.</Card>;
  return (
    <div>
      {authorizations.map((authorization, i) => {
        const subroutine = getSubroutine(authorization.subroutine);
        const functions = subroutine.functions;
        const isSubroutinePermissionless = isPermissionless(authorization.mode);

        const isAtomic =
          displaySubroutineType(authorization.subroutine) === "ATOMIC";
        const subroutineLabel = authorization.label;

        const authTokenDenom = isSubroutinePermissionless
          ? null
          : permissionFactoryDenom({
              authorizationsAddress,
              authorizationLabel: subroutineLabel,
            });

        const authTokenBalance = balances?.find(
          (b) => b.denom === authTokenDenom,
        );
        const isHoldingAuthToken = !!authTokenBalance;
        const isAuthorized = isSubroutinePermissionless
          ? true
          : isLoadingBalances
            ? false
            : !!isHoldingAuthToken;

        const executionLimit = getExecutionLimit(
          authorization.mode,
          walletAddress ?? null,
        );

        return (
          <CollapsibleSectionRoot
            key={`authorization-${authorization.label}-${i}`}
            className={cn(
              authorizations.length > 1 &&
                i !== authorizations.length - 1 &&
                "border-b-0",
            )}
            variant="primary"
            defaultIsOpen={false}
          >
            <CollapsibleSectionHeader>
              <div className="flex flex-col gap-1 w-full">
                <Heading level="h3">{subroutineLabel.toUpperCase()}</Heading>
                <div className="flex flex-row gap-2">
                  <Label variant={isAtomic ? "teal" : "purple"}>
                    {displaySubroutineType(authorization.subroutine)}
                  </Label>
                  <Label>{displayAuthMode(authorization.mode)}</Label>
                </div>
              </div>
            </CollapsibleSectionHeader>
            <CollapsibleSectionContent>
              <div className="pb-2">
                {" "}
                <PermissionsDisplay
                  isPermissionless={isSubroutinePermissionless}
                  executionLimit={executionLimit ?? null}
                  authToken={authTokenDenom ?? null}
                />
              </div>

              {/* it's a separate component because each subroutine should have its own useForm instantiation */}
              <ExecutableSubroutine
                program={program}
                authTokenDenom={authTokenDenom}
                subroutineLabel={subroutineLabel}
                authorizationsAddress={authorizationsAddress}
                isAtomic={isAtomic}
                key={`subroutine-${authorization.label}-${i}`}
                functions={functions}
                isAuthorized={isAuthorized}
                authTokenBalance={authTokenBalance}
                executionLimit={executionLimit}
                queryConfig={queryConfig}
              />
            </CollapsibleSectionContent>
          </CollapsibleSectionRoot>
        );
      })}
    </div>
  );
};
