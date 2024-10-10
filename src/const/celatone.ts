import { chainConfig } from "@/const/config";

class CelatoneUrl {
  static trasaction = (transactionHash: string) => {
    return `${chainConfig.celatoneUrl}/txs/${transactionHash}`;
  };
  static block = (blockHeight: number) => {
    return `${chainConfig.celatoneUrl}/blocks/${blockHeight}`;
  };
  static contract = (address: string) => {
    return `${chainConfig.celatoneUrl}/contracts/${address}`;
  };
}

export { CelatoneUrl };
