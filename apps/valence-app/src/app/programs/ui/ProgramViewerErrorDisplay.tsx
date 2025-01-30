import { CalloutBox } from "@valence-ui/ui-components";
import { GetProgramDataReturnValue } from "@/app/programs/server";

export const ProgramViewerErrorDisplay = ({
  data,
}: {
  data: GetProgramDataReturnValue;
}) => {
  if (!data?.rawProgram)
    return (
      <CalloutBox
        variant="error"
        className=" w-full"
        title="Program ID Not Found"
      >
        Check registry address and program ID.
      </CalloutBox>
    );
  else if (!data?.parsedProgram)
    return (
      <CalloutBox
        variant="error"
        className=" w-full"
        title="Failed to parse program"
      >
        Configuration format not supported in the UI.
      </CalloutBox>
    );
  else
    return (
      <div className="flex flex-col w-full gap-1">
        {!data?.balances && (
          <CalloutBox
            variant="error"
            title="Failed to fetch account balances"
          ></CalloutBox>
        )}
      </div>
    );
};
