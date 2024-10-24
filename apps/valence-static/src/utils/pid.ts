import Controller from "node-pid-controller";

/**
 * Simulate rebalancing with a PID controller.
 *
 * @param kp P in PID
 * @param ki I in PID
 * @param kd D in PID
 * @param numRebalances How many rebalances to simulate.
 * @param assets Assets to rebalance.
 * @returns A list of all assets' amounts after each rebalance, including the
 * initial amount. This will be `numRebalances + 1` elements long.
 */
export const simulate = (
  kp: number,
  ki: number,
  kd: number,
  numRebalances: number,
  assets: {
    amount: number;
    price: number;
    target: number;
  }[],
) => {
  // PID controller for each asset.
  const controllers = assets.map(
    () =>
      new Controller({
        k_p: kp,
        k_i: ki,
        k_d: kd,
        dt: 1,
      }),
  );

  // Each projection is a list of all assets' amount and price after each
  // rebalance.
  const projections = [...Array(numRebalances)].reduce(
    (acc: number[][]) => {
      const lastProjection = acc[acc.length - 1];

      // Create new projections for each asset.
      const newProjection = assets.map((_, index) => lastProjection[index]);

      // Get total value of assets.
      const totalValue = newProjection.reduce(
        (acc, amount, index) => acc + amount * assets[index].price,
        0,
      );

      // Use PID controller with new values to rebalance amounts.
      assets.forEach(({ target }, index) => {
        const controller = controllers[index];
        const lastAmount = newProjection[index];
        const price = assets[index].price;

        const targetValue = target * totalValue;
        controller.setTarget(targetValue);

        const currentValue = lastAmount * price;
        // Rebalance with PID.
        const rebalanceValue = controller.update(currentValue);
        // Cannot sell more than we have.
        const newAmount = Math.max(0, lastAmount + rebalanceValue / price);

        // Update projection amount.
        newProjection[index] = newAmount;
      });

      return [...acc, newProjection];
    },
    [
      // Start with initial amount.
      assets.map(({ amount }) => amount),
    ],
  );

  return projections;
};
