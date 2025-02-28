"use client";
import {
  isPermissioned,
  isPermissionless,
  isPermissionWithLimit,
  isPermissionWithoutLimit,
} from "@/app/programs/server";
import { Heading, InfoText } from "@valence-ui/ui-components";
import { AuthorizationInfo } from "@valence-ui/generated-types";
import { permissionFactoryDenom } from "@/app/programs/ui";

export const PermissionsDisplay = ({
  authorization,
  authorizationsAddress,
}: {
  authorizationsAddress: string;
  authorization: AuthorizationInfo;
}) => {
  if (isPermissionless(authorization.mode)) {
    return;
  }
  if (isPermissioned(authorization.mode)) {
    return (
      <div>
        <Heading level="h4">Required Authorizations</Heading>

        {isPermissionWithLimit(authorization.mode.permissioned) && (
          <>
            <div className="font-mono text-xs text-wrap break-words">
              {permissionFactoryDenom({
                authorizationsAddress,
                authorizationLabel: authorization.label,
              })}
            </div>
            <InfoText>Limited executions</InfoText>
          </>
        )}
        {isPermissionWithoutLimit(authorization.mode.permissioned) && (
          <ul>
            {authorization.mode.permissioned.without_call_limit.map(
              (originalReciever) => {
                return (
                  <li
                    className="font-mono text-xs text-wrap break-words"
                    key={`permission`}
                  >
                    {permissionFactoryDenom({
                      authorizationsAddress,
                      authorizationLabel: authorization.label,
                    })}
                  </li>
                );
              },
            )}
          </ul>
        )}
      </div>
    );
  }
};
