"use server";

export async function fetchValenceAccountConfiguration({
  address,
}: {
  address: string;
}): Promise<ValenceAccountConfig> {
  // TODO: indexer API call /account [valenceAddress] [date=today]
  return Promise.resolve(VALENCE_ACCOUNT_CONFIG);
}

const VALENCE_ACCOUNT_CONFIG: ValenceAccountConfig = {
  baseToken: "uusdc",
  targets: [
    {
      denom: "untrn",
      percent: 0.2,
    },
    {
      denom: "uatom",
      percent: 0.25,
    },
    {
      denom: "uusdc",
      percent: 0.4,
    },
    {
      denom: "uosmo",
      percent: 0.15,
    },
  ],
  pid: {
    kp: 0.4,
    ki: 0.2,
    kd: 0.1,
  },
};

type Target = {
  denom: string;
  percent: number;
};

export type ValenceAccountConfig = {
  baseToken: string;
  targets: Target[];
  pid: {
    kp: number;
    ki: number;
    kd: number;
  };
};
