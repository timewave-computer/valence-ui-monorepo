import { CalloutBox } from "@valence-ui/ui-components";
import { GetProgramDataReturnValue } from "@/app/programs/server";

export const ProgramViewerErrorDisplay = ({
  errors = {},
}: {
  errors?: GetProgramDataReturnValue["errors"];
}) => {
  return (
    <div className="flex flex-col gap-1">
      {Object.entries(errors).map(([key, error]) => {
        return (
          <CalloutBox
            key={`program-api-error-${key}`}
            variant="error"
            className=" w-full"
            title={error.title}
          >
            {error.text && <>{error.text}</>}
            {error.message && <div>{error.message}</div>}
          </CalloutBox>
        );
      })}
    </div>
  );
};
