// for metadata and description see src/app/.well-known/vercel/flags/route.ts
// They are boolean values saved as strings, so make sure to handle string -> boolean interpretation appropriately

export enum FeatureFlags {
  REBALANCER_GRAPH_TARGETS = "REBALANCER_GRAPH_TARGETS",
  REBALANCER_NONUSDC_VALUE = "REBALANCER_NONUSDC_VALUE",
  COVENANTS_VIEW_POL = "COVENANTS_VIEW_POL",
}

export const FeatureFlagDefinitions = {
  [FeatureFlags.REBALANCER_GRAPH_TARGETS]: {
    description: "Allow user to add value targets to the graph",
    options: [
      { value: false, label: "Off" },
      { value: true, label: "On" },
    ],
  },
  [FeatureFlags.REBALANCER_NONUSDC_VALUE]: {
    description: "Button to change base denom in graph (NOT IMPLEMENTED)",
    options: [{ value: false, label: "Off" }],
  },
  [FeatureFlags.COVENANTS_VIEW_POL]: {
    description: "Allow user to view LP covenant type",
    options: [
      { value: false, label: "Off" },
      { value: true, label: "On" },
    ],
  },
};
