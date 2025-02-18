import { Button, cn } from "@valence-ui/ui-components";
import { BiRefresh } from "react-icons/bi";

export const RefetchButton = ({
  refetch,
  isFetching,
}: {
  refetch: () => void;
  isFetching: boolean;
}) => {
  return (
    <Button
      className="min-w-0"
      variant={"secondary"}
      onClick={() => refetch()}
      disabled={isFetching}
      iconClassName={cn("w-5 h-5", isFetching && "animate-spin")}
      SuffixIcon={BiRefresh}
    />
  );
};
