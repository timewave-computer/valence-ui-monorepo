export const CreateRebalancerCopy = {
  step_SelectAssets: {
    title: "Step 1: Select assets to rebalance",
    subTitle:
      "Which assets would you like to rebalance?  You can choose from the assets in your wallet which are supported by the Rebalancer.",
    info1: "",
  },
  step_StartingAmounts: {
    title: "Step 2: Select funds to deposit",
    subTitle:
      "How much of each asset would you like to allocate for rebalancing? ",
    info1:
      "You can choose to allocate all or a portion of your assets. These funds will be transferred to your Rebalancer account upon creation.",
  },
  step_SelectTargets: {
    title: "Step 3: Set rebalance targets",
    subTitle:
      "What distribution would you like your funds to be rebalanced into?",
    info1: "The token in which your assets will be valued in.",
  },
  step_Settings: {
    title: "Step 4: Set Rebalancer settings",
    subTitle: "How quickly would you like your funds to be rebalanced?",
    info1:
      "This will determine how much is traded in a single day. The larger the quantity, the most susceptible you are to price volatility.",
  },
  step_Trustee: {
    title: "Step 5: Choose a trustee",
    subTitle: "Who can pause and resume rebalancing on this account?",
    info1:
      "In case of emergency, you can grant permission to another wallet to pause and resume the Rebalancer. This will NOT grant permission make configuration changes or withdrawals.",
  },
};
