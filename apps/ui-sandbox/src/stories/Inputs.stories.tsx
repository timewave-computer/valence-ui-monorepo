"use client";
import { Section, Story } from "~/components";
import {
  cn,
  FormField,
  FormRoot,
  FormTextInput,
  TextInput,
  TextInputProps,
} from "@valence-ui/ui-components";
import { Fragment, useState } from "react";

const Inputs = () => {
  const [text, setText] = useState("");
  const [num, setNum] = useState("");

  const sizes = ["base", "sm"] as Array<TextInputProps["size"]>;
  const variants = ["primary", "form"] as Array<TextInputProps["variant"]>;
  return (
    <Section className="">
      <div className="grid grid-cols-4 gap-4">
        {variants.map((variant) => {
          return (
            <Fragment key={variant}>
              {sizes.map((size) => {
                return (
                  <Fragment key={`${variant}-${size}`}>
                    <Story>
                      <TextInput
                        size={size}
                        variant={variant}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="neutron12345..."
                      />
                    </Story>
                    <Story>
                      <TextInput
                        size={size}
                        variant={variant}
                        type="number"
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        placeholder="0.00"
                        suffix="%"
                      />
                    </Story>
                    <Story>
                      <TextInput
                        size={size}
                        variant={variant}
                        type="number"
                        isError={true}
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        placeholder="0.00"
                        suffix="%"
                      />
                    </Story>

                    <Story>
                      <TextInput
                        size={size}
                        variant={variant}
                        type="number"
                        isDisabled={true}
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        placeholder="0.00"
                        suffix="%"
                      />
                    </Story>
                  </Fragment>
                );
              })}
              <div className="col-span-4 py-4" />
            </Fragment>
          );
        })}
      </div>
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
            value={text}
            onChange={(e) => setText(e.target.value)}
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
