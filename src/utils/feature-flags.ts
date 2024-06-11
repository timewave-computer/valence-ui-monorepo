/***
 * Class to manage feature flags
 * They are boolean values saved as strings, so make sure to handle string -> boolean interpretation appropriately
 */

export class FeatureFlags {
  static COVENANTS_TOGGLE_ENABLED() {
    return process.env.NEXT_PUBLIC_FF_COVENANTS_TOGGLE_ENABLED === "true"
      ? true
      : false;
  }
  static REBALANCER_NON_USDC_VALUE_ENABLED() {
    return process.env.NEXT_PUBLIC_FF_REBALANCER_NONUSDC_VALUE === "true"
      ? true
      : false;
  }
}
