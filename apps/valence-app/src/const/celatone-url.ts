const CELATONE_URL = "https://neutron.celat.one";

// TODO: pass chainID everywhere for programs.

class CelatoneUrl {
  static transaction = (transactionHash: string, chainId?: string) => {
    return `${CELATONE_URL}/${chainId}/txs/${transactionHash}`;
  };
  static block = (blockHeight: number | string, chainId?: string) => {
    return `${CELATONE_URL}/${chainId}/blocks/${blockHeight}`;
  };
  static contract = (address: string, chainId?: string) => {
    return `${CELATONE_URL}/${chainId}/contracts/${address}`;
  };
}

export { CelatoneUrl };
