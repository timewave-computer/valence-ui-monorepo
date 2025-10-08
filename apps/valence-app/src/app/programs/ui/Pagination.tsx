import { Button, cn } from "@valence-ui/ui-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Pagination = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
}: {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled?: boolean;
}) => {
  return (
    <>
      <Button
        disabled={isPreviousDisabled}
        className=" min-w-0"
        variant={"secondary"}
        onClick={isPreviousDisabled ? undefined : onPrevious}
        iconClassName={cn("w-3 h-3")}
        SuffixIcon={FaChevronLeft}
      />
      <Button
        className=" min-w-0"
        variant={"secondary"}
        onClick={onNext}
        iconClassName={cn("w-3 h-3")}
        SuffixIcon={FaChevronRight}
      />
    </>
  );
};
