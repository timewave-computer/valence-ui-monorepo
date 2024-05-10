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
      percent: 0.333333,
    },
    {
      denom: "uatom",
      percent: 0.333333,
    },
    {
      denom: "uusdc",
      percent: 0.333333,
    },
  ],
  pidPreset: "default",
};

type Target = {
  denom: string;
  percent: number;
};

type ValenceAccountConfig = {
  baseToken: string;
  targets: Target[];
  pidPreset: string;
};
