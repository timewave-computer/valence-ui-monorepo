"use client";
import { Section, Story } from "~/components";
import {
  InputLabel,
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
        <Story className="gap-0">
          <InputLabel size="lg" label="Primary" />
          <TextInput
            variant="primary"
            size="base"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="neutron12345..."
          />
        </Story>
        <Story className="gap-0">
          <InputLabel size="lg" label="Secondary" />
          <TextInput
            variant="form"
            size="base"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="neutron12345..."
          />
        </Story>
        <div className="col-span-2"></div>
        <Story className="gap-0">
          <InputLabel size="sm" label="Primary small" />
          <TextInput
            variant="primary"
            size="sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="neutron12345..."
          />
        </Story>
        <Story className="gap-0">
          <InputLabel size="sm" label="Secondary small" />
          <TextInput
            variant="form"
            size="sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="neutron12345..."
          />
        </Story>
        <div className="col-span-2"></div>
        <div className="col-span-4 py-4" />
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
    </Section>
  );
};

export default Inputs;
