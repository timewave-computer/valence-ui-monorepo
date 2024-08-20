export const CreateRebalancerCopy = {
  step_SelectAssets: {
    title: "Step 1: Select funds to rebalance",
    subTitle:
      "Which funds would you like rebalanced? Specify the amounts that will be deposited to your Rebalancer account upon creation.",
    info1: "",
  },
  step_edit_SelectAssets: {
    // for edit
    title: "Step 1: Enable rebalancing for assets",
    subTitle:
      "These are the assets in your Rebalancer account. Assets with a target are enabled for rebalancing.",
    info1: "",
  },
  step_SelectTargets: {
    title: "Step 2: Set targets",
    subTitle:
      "What distribution would you like your funds to be rebalanced into?",
    info1: "The token in which your assets will be valued in.",
  },
  step_Settings: {
    title: "Step 3: Set Rebalancer settings",
    subTitle: "How quickly would you like your funds to be rebalanced?",
    info1:
      "This will determine how much is traded in a single day. The larger the quantity, the most susceptible you are to price volatility.",
  },
  step_Trustee: {
    title: "Step 4: Choose a trustee",
    subTitle: "Who can pause and resume rebalancing on this account?",
    info1:
      "In case of emergency, you can grant permission to another wallet to pause and resume the Rebalancer. This will NOT grant permission make configuration changes or withdrawals.",
  },
};
