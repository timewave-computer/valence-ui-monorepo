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

  try {
    const inputObject = JSON.parse(value);
    restrictions.forEach((restriction) => {
      if (isMustBeIncludedParamRestriction(restriction)) {
        const keys = restriction.must_be_included;
        if (isNestedValueEqual(inputObject, keys, undefined)) {
          errors.push(`${keys.join(".")} must be included`);
        }
      } else if (isCannotBeIncludedParamRestriction(restriction)) {
        const keys = restriction.cannot_be_included;
        if (!isNestedValueEqual(inputObject, keys, undefined)) {
          errors.push(`${keys.join(".")} cannot be included`);
        }
      } else if (isMustBeValueParamRestriction(restriction)) {
        const [keys, value] = restriction.must_be_value;
        if (!isNestedValueEqual(inputObject, keys, value)) {
          errors.push(`${keys.join(".")} must equal  "${value}"`);
        }
      } else {
        console.warn(`Unsupported param restriction type. ${restriction}`);
      }
    });
  } catch (e) {
    errors.push("Invalid JSON");
  }
  return errors;
};

function getNestedValue(obj: any, keys: string[]): any {
  return keys.reduce(
    (current, key) =>
      current && current[key] !== undefined ? current[key] : undefined,
    obj,
  );
}

function isNestedValueEqual(obj: any, keys: string[], value): boolean {
  return getNestedValue(obj, keys) === value;
}
