/***
 * Class to manage feature flags
 * They are boolean values saved as strings, so make sure to handle string -> boolean interpretation appropriately
 */

class FeatureFlags {
  COVENANTS_ENABLED() {
    const FF_COVENANTS_ENABLED =
      process.env.NEXT_PUBLIC_FF_COVENANTS_ENABLED ?? false;
    return FF_COVENANTS_ENABLED === "true" ? true : false;
  }
}

export const FFs = new FeatureFlags();
