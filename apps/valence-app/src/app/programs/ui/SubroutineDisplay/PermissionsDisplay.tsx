"use client";
import { Heading, InfoText } from "@valence-ui/ui-components";

export const PermissionsDisplay = ({
  authToken,
  executionLimit,
  isPermissionless,
}: {
  isPermissionless?: boolean;
  executionLimit: string | null;
  authToken: string | null;
}) => {
  return (
    <div>
      <Heading level="h4">Required Authorizations</Heading>
      {isPermissionless ? (
        <div className="font-mono text-xs text-wrap break-words">None</div>
      ) : (
        <>
          <div className="font-mono text-xs text-wrap break-words">
            {authToken}
          </div>
          {executionLimit && <InfoText>Limited executions</InfoText>}
        </>
      )}
    </div>
  );
};
