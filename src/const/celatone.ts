import { chainConfig } from "@/const/config";

class CelatoneUrl {
  static trasaction = (transactionHash: string) => {
    return `${chainConfig.celatoneUrl}/txs/${transactionHash}`;
  };
}

export { CelatoneUrl };
