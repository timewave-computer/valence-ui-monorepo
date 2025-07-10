"use client";
import {
  isPermissionless,
  type GetProgramDataReturnValue,
  getExecutionLimit,
  type ProgramQueryConfig,
  NormalizedAuthorizations,
} from "@/app/programs/server";
import {
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
import { useDenomBalance } from "@/hooks";
import { useAccount } from "graz";

export const AuthorizationDisplay = ({
  program,
  queryConfig,
  authorization,
  authorizationsAddress,
  className,
}: {
  program: GetProgramDataReturnValue;
  queryConfig: ProgramQueryConfig;
  authorization: NormalizedAuthorizations[number];
  authorizationsAddress: string;
  className?: string;
}) => {
  const { data: account } = useAccount();
  const walletAddress = account?.bech32Address;
  const isSubroutinePermissionless = isPermissionless(authorization.mode);
  const subroutineLabel = authorization.label;
  const subroutine = getSubroutine(authorization.subroutine);
  const functions = subroutine.functions;
  const executionLimit = getExecutionLimit(
    authorization.mode,
    walletAddress ?? null,
  );

  const isAtomic = displaySubroutineType(authorization.subroutine) === "ATOMIC";

  const authTokenDenom = isSubroutinePermissionless
    ? null
    : permissionFactoryDenom({
        authorizationsAddress,
        authorizationLabel: subroutineLabel,
      });

  const { data: authTokenBalance, isLoading: isLoadingAuthTokenBalance } =
    useDenomBalance({
      denom: authTokenDenom ?? undefined,
      rpcUrl: queryConfig?.main?.rpc,
      address: walletAddress,
    });

  const isHoldingAuthToken =
    authTokenBalance?.amount && Number(authTokenBalance.amount) > 0;
  const isAuthorized = isSubroutinePermissionless
    ? true
    : isLoadingAuthTokenBalance
      ? false
      : !!isHoldingAuthToken;

  return (
    <CollapsibleSectionRoot
      className={className}
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
          functions={functions}
          isAuthorized={isAuthorized}
          authTokenBalance={authTokenBalance}
          executionLimit={executionLimit}
          queryConfig={queryConfig}
        />
      </CollapsibleSectionContent>
    </CollapsibleSectionRoot>
  );
};
