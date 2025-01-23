import { Message, MessageDetails } from "@valence-ui/generated-types";
import {
  isCannotBeIncludedParamRestriction,
  isMustBeIncludedParamRestriction,
  isMustBeValueParamRestriction,
} from "@/app/programs/server";

export function generateMessageBody(messageDetails: MessageDetails) {
  try {
    if (messageDetails.message_type === "cosmwasm_execute_msg") {
      return generateCosmwasmMessageBody(messageDetails.message);
    } else {
      throw new Error(
        `Unsupported message type ${messageDetails.message_type}`,
      );
    }
  } catch (error) {
    console.warn(`Error pre-generating message body: ${error}`);
    return {};
  }
}

const generateCosmwasmMessageBody = (message: Message) => {
  const contents = {};
  message.params_restrictions?.forEach((restriction) => {
    if (isMustBeIncludedParamRestriction(restriction)) {
      const keys = restriction.must_be_included;
      const nestedObject = constructNestedObject(keys, "");
      Object.assign(contents, nestedObject);
    } else if (isCannotBeIncludedParamRestriction(restriction)) {
      // nothing to do, more relevant in validation
    } else if (isMustBeValueParamRestriction(restriction)) {
      const [keys, value] = restriction.must_be_value;
      const nestedObject = constructNestedObject(keys, value);
      Object.assign(contents, nestedObject);
    } else {
      console.warn(`Unsupported param restriction type. ${restriction}`);
    }
  });

  return contents;
};

function constructNestedObject(keys: string[], value: string) {
  if (keys.length === 0) {
    return value;
  }

  const [firstKey, ...restKeys] = keys;
  return {
    [firstKey]: constructNestedObject(restKeys, value),
  };
}
