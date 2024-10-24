// convert micro denom to denom
export const microToBase = (
  amount: number | string,
  decimals: number,
): number => {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount / Math.pow(10, decimals);
  return isNaN(amount) ? 0 : amount;
};

// convert denom to micro denom
export const baseToMicro = (amount: number | string, decimals: number) => {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  // Need to round. Example: `8.029409 * Math.pow(10, 6)`.
  amount = Math.round(amount * Math.pow(10, decimals));
  return isNaN(amount) ? 0 : amount;
};

// Using BigInt.toString() ensures the value is not abbreviated. The
// Number.toString() function abbreviates large numbers like 1e20.
export const baseToMicroDenomString = (
  ...params: Parameters<typeof baseToMicro>
) => BigInt(baseToMicro(...params)).toString();
