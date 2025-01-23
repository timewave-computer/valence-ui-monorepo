"use client";
import { Section, Story } from "~/components";
import {
  InputLabel,
  TextInput,
  TextInputProps,
  TextAreaInput,
} from "@valence-ui/ui-components";
import { Fragment, useState } from "react";

const Inputs = () => {
  const [text, setText] = useState("");
  const [num, setNum] = useState("");

  const sizes = ["base", "sm"] as Array<TextInputProps["size"]>;

  return (
    <Section className="">
      <div className="grid grid-cols-4 gap-4">
        {sizes.map((size) => {
          return (
            <Fragment key={`inputfield-${size}`}>
              <Story className="gap-0">
                <InputLabel label={`Label`} size={size} />
                <TextInput
                  size={size}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="neutron12345..."
                />
              </Story>
              <Story className="gap-0">
                <InputLabel label={`Label`} size={size} />
                <TextInput
                  size={size}
                  type="number"
                  value={num}
                  onChange={(e) => setNum(e.target.value)}
                  placeholder="0.00"
                  suffix="%"
                />
              </Story>
              <Story className="gap-0">
                <InputLabel label={`Label`} size={size} />
                <TextInput
                  size={size}
                  type="number"
                  isError={true}
                  value={num}
                  onChange={(e) => setNum(e.target.value)}
                  placeholder="0.00"
                  suffix="%"
                />
              </Story>
              <Story className="gap-0">
                <InputLabel label={`Label`} size={size} />

                <TextInput
                  size={size}
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

        {sizes.map((size) => {
          return (
            <Fragment key={`textarea-${size}`}>
              <Story className="gap-0 col-span-2">
                <InputLabel label={`Label`} size={size} />

                <TextAreaInput />
              </Story>
              <Story className="gap-0">
                <InputLabel label={`Label`} size={size} />

                <TextAreaInput isError={true} />
              </Story>
              <Story className="gap-0">
                <InputLabel label={`Label`} size={size} />

                <TextAreaInput isDisabled={true} />
              </Story>
            </Fragment>
          );
        })}
      </div>
    </Section>
  );
};

export default Inputs;
