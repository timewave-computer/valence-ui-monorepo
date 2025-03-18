import { chainConfig } from "@/const/config";

class CelatoneUrl {
  static transaction = (transactionHash: string) => {
    return `${chainConfig.celatoneUrl}/txs/${transactionHash}`;
  };
  static block = (blockHeight: number | string) => {
    return `${chainConfig.celatoneUrl}/blocks/${blockHeight}`;
  };
  static contract = (address: string) => {
    return `${chainConfig.celatoneUrl}/contracts/${address}`;
  };
  static account = (address: string) => {
    return `${chainConfig.celatoneUrl}/accounts/${address}`;
  };
}

export { CelatoneUrl };
