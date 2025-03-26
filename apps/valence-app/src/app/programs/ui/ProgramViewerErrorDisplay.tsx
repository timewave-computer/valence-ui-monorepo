import { CalloutBox } from "@valence-ui/ui-components";
import { GetProgramDataReturnValue } from "@/app/programs/server";

export const ProgramViewerErrorDisplay = ({
  errors,
}: {
  errors?: GetProgramDataReturnValue["errors"];
}) => {
  if (!!errors && errors.length) {
    return (
      <div className="flex flex-col gap-1">
        {errors.map((error) => {
          return (
            <CalloutBox
              key={`program-api-error-${error.key}-${error.message}-${error.text}`}
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
  } else {
    return null;
  }
};
