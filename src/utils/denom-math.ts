export const baseToUnit = (
  amount: number | string,
  decimals: number,
): number => {
  let amt: number;
  if (typeof amount === "string") {
    amt = Number(amount);
  } else {
    amt = amount;
  }
  return amt / 10 ** decimals;
};
