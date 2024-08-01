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
    info2:
      "Choose your targets and configure the rebalance speed. The Rebalancer will attempt trades each day to move towards your targets.",
  },
  step_Settings: {
    title: "Step 4: Set Rebalancer settings",
    subTitle: "Configure the speed and other settings for your Rebalancer.",
    info1:
      "This will determine how much is traded in a single day. The larger the quantity, the most susceptible you are to price volatility.",
    info2: "Simulation of trades based on your settings ",
  },
  step_Trustee: {
    title: "Step 5: Who can pause and resume the rebalancing on this account?",
    subTitle:
      "In case of emergency, you can grant permission to another address to pause and resume Rebalancing. This address will not be able to make other changes our withdrawals from the account.",
  },
};
