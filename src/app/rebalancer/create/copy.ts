export const CreateRebalancerCopy = {
  step_SelectAssets: {
    title: "Step 1: Deposit assets",
    subTitle:
      "The Rebalancer will only rebalance assets that are deposited into the Rebalancer account.",
  },
  step_edit_SelectAssets: {
    // for edit
    title: "Step 1: Select assets",
    subTitle: "Select assets in the account to be rebalanced.",
  },
  step_SelectTargets: {
    title: "Step 2: Set targets",
    subTitle:
      "Determine your target treasury by setting the percentage targets for each asset below.",
  },
  step_Settings: {
    title: "Step 3: Set rebalance speed",
    subTitle:
      "Determine how quickly you would like the Rebalancer to reach your treasury targets.",
  },
  step_Trustee: {
    title: "Step 4: Choose a trustee",
    subTitle: "Who can pause and resume rebalancing on this account?",
    info1:
      "In case of emergency, you can grant permission to another wallet to pause and resume the Rebalancer. This will NOT grant permission make configuration changes or withdrawals.",
  },
};

export const RebalancerFormTooltipCopy = {
  serviceFee: {
    title: "Service fee",
    text: "This is a one time fee, collected to avoid spam. It is withdrawn in addition to the selected deposit amounts.",
  },
  minBalance: {
    title: "Minimum balance (optional)",
    text: "Minimum balance to maintain. Only one token in your portfolio is allowed to have a minimum balance.",
  },
  rebalanceSpeed: {
    title: "Rebalance speed",
    text: "Generally, the slower you set the speed the better the price execution.",
  },
  projection: {
    title: "Projection",
    text: "Simulation of how balances in your Rebalancer account will change with the current settings. The projection assumes a constant price.",
  },
  baseDenom: {
    title: "Base denomination token",
    text: "This is the token used to calculate the value of your portfolio.",
  },
  strategy: {
    title: "Target override strategy",
    text: `
    In some cases, the rebalancer may have to override a target to respect a minimum balance requirement configured by the user. 

A proportional strategy will spread the override amount to all the other targets based on their weight. 

A priority strategy will spread the override amount in order of priority. Priority is determined by the order of the targets in the targets list.`,
  },
  maxLimit: {
    title: "Maximum daily limit (BPS)",
    text: `This is in bps (basis points). Maximum percentage value of the portfolio that can be sold each day.`,
  },
  trustee: {
    title: "Trustee (optional)",
    text: `Only trustees can pause and resume rebalancing.

You can grant permission to another wallet to pause and resume rebalancing in case of emergency. Trustees do NOT have permission to make configuration changes or withdrawals. `,
  },
};
