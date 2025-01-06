"use client";
import { Section, Story } from "~/components";
import {
  cn,
  FormField,
  FormRoot,
  FormTextInput,
  TextInput,
} from "@valence-ui/ui-components";
import { useState } from "react";

const Inputs = () => {
  const [value, setValue] = useState("");
  const [num, setNum] = useState(0);

  return (
    <Section className="w-1/2">
      <Story>
        <TextInput
          containerClassName="w-full"
          placeholder="neutron12345..."
          input={value}
          onChange={setValue}
        />
      </Story>
      <Story>
        <div
          className={cn(
            "border-valence-lightgray bg-valence-lightgray",
            " flex items-center border-[1.5px]  focus-within:border-valence-blue"
          )}
        >
          <input
            className={cn(
              " font-mono",

              "h-full w-full bg-transparent p-2 transition-all focus:outline-none"
            )}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="neutron1234..."
          />
        </div>
      </Story>
      <Story>
        <FormRoot>
          <FormField name="maxLimit">
            <FormTextInput
              value={num}
              onChange={(e) => setNum(Number(e.target.value))}
              isError={num < 0 || num > 1}
              type="number"
              placeholder="0"
            />
          </FormField>
        </FormRoot>
      </Story>
      <p>
        TODO: consolidate these two. deprecate the old, make 2 variants. use
        radix input? seperate out form logic?{" "}
      </p>
    </Section>
  );
};

export default Inputs;
