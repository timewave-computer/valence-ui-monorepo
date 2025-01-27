import { UTCDate } from "@date-fns/utc";
import { subSeconds } from "date-fns";

export function getBlockDate({
  estimatedBlockTime,
  blockNumber,
  currentBlockNumber,
}: {
  estimatedBlockTime: number;
  blockNumber: number;
  currentBlockNumber: number;
}) {
  const blockDifference = currentBlockNumber - blockNumber;
  const secondsDifference = blockDifference * estimatedBlockTime;
  const nowDate = new UTCDate(UTCDate.now());
  return subSeconds(nowDate, secondsDifference);
}
