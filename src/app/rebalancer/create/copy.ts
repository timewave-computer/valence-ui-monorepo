export const CreateRebalancerCopy = {
  step1: {
    title: "Step 1: Select funds to rebalance",
    subTitle:
      "No funds will be transferred from your wallet until you click ‘Execute’.",
    info1:
      "Choose which assets you would like to rebalance and the initial funding amount. You must select at least two.",
  },
  step2: {
    title: "Step 2: Set target allocation",
    subTitle: "You will be able to change this configuration later.",
    info1: "The token in which your assets will be valued in.",
    info2:
      "Choose your targets and configure the rebalance speed. The Rebalancer will attempt trades each day to move towards your targets.",
  },
  step3: {
    title: "Step 3: Set Rebalancer settings",
    subTitle: "You will be able to change this configuration later.",
    info1:
      "This will determine how much is traded in a single day. The larger the quantity, the most susceptible you are to price volatility.",
    info2: "Simulation of trades based on your settings ",
  },
  step4: {
    title: "Step 4: Who can pause and resume the rebalancing on this account?",
    subTitle:
      "In case of emergency, you can grant permission to another address to pause and resume Rebalancing. This address will not be able to make other changes our withdrawals from the account.",
  },
};
