import { useHydrateAtoms } from "jotai/utils";
/***
 * Component to set initial values for jotai atoms on initial render
 */
export const HydrateAtoms = ({ initialValues, children }) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues);
  return children;
};
