import { ParamRestriction } from "@valence-ui/generated-types";
import {
  isMustBeIncludedParamRestriction,
  isCannotBeIncludedParamRestriction,
  isMustBeValueParamRestriction,
} from "@/app/programs/server";

export const validateJsonWithRestrictions = (
  value: string,
  restrictions: ParamRestriction[],
): string[] => {
  const errors: string[] = [];
  // console.log('value',value,'restrictions', restrictions);

  try {
    const parsed = JSON.parse(value);
    //   restrictions.forEach((restriction) => {
    //     if (isMustBeIncludedParamRestriction(restriction)) {
    //       const keys = restriction.must_be_included;
    //       if (!keys.every(key => key in parsed)) {
    //         errors.push(`Missing required keys: ${keys.join(", ")}`);
    //       }
    //     } else if (isCannotBeIncludedParamRestriction(restriction)) {
    //       const keys = restriction.cannot_be_included;
    //       if (keys.some(key => key in parsed)) {
    //         errors.push(`Keys cannot be included: ${keys.join(", ")}`);
    //       }
    //     } else if (isMustBeValueParamRestriction(restriction)) {
    //       const [keys, value] = restriction.must_be_value;
    //       if (keys.some(key => parsed[key] !== value)) {
    //         errors.push(`Keys must have value ${value}: ${keys.join(", ")}`);
    //       }
    //     } else {
    //       console.warn(`Unsupported param restriction type. ${restriction}`);
    //     }
    //   });
  } catch (e) {
    errors.push("Invalid JSON");
  }
  return errors;
};
