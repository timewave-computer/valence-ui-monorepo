import { PrettyJson } from "@valence-ui/ui-components";
import { type GetProgramDataReturnValue } from "@/app/programs/server";

export const RpcConfigForm = ({
  queryConfig,
}: {
  queryConfig: GetProgramDataReturnValue["queryConfig"];
}) => {
  return (
    <div>
      <PrettyJson data={queryConfig} />
    </div>
  );
};
