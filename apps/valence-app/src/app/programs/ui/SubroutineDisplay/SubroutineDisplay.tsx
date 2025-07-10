"use client";
import {
  type GetProgramDataReturnValue,
  type ProgramQueryConfig,
} from "@/app/programs/server";
import { Card, cn } from "@valence-ui/ui-components";
import { AuthorizationDisplay } from "@/app/programs/ui";

export const SubroutineDisplay = ({
  program,
  queryConfig,
}: {
  program?: GetProgramDataReturnValue;
  queryConfig: ProgramQueryConfig;
}) => {
  const authorizations = program?.parsedProgram?.authorizations;
  const authorizationsAddress =
    program?.parsedProgram?.authorizationData?.authorization_addr ?? "";
  if (!authorizations)
    return <Card className="grow h-full">No subroutines to display.</Card>;
  return (
    <div>
      {authorizations.map((authorization, i) => {
        return (
          <AuthorizationDisplay
            key={`authorization-${authorization.label}`}
            program={program}
            queryConfig={queryConfig}
            authorization={authorization}
            authorizationsAddress={authorizationsAddress}
            className={cn(
              authorizations.length > 1 &&
                i !== authorizations.length - 1 &&
                "border-b-0",
            )}
          />
        );
      })}
    </div>
  );
};
