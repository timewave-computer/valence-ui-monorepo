import { UTCDate } from "@date-fns/utc";

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
  const date = new UTCDate(UTCDate.now() - secondsDifference * 1000);
  return date;
}
