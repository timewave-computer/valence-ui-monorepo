import { chainConfig } from "@/const/config";

class MintscanUrl {
  static block = (blockHeight: number | string) => {
    return `${chainConfig.mintscanUrl}/block/${blockHeight}?chainId=${chainConfig.chain.chain_id}`;
  };
}

export { MintscanUrl };
