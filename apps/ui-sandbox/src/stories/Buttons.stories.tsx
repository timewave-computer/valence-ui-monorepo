import { Section, Story } from "~/components";
import { Button, ButtonProps } from "@valence-ui/ui-components";
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2";

const Buttons = () => {
  const sizes = ["base", "sm"] as Array<ButtonProps["size"]>;
  return (
    <Section className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div className="flex flex-row gap-2 flex-wrap" key={`button-${size}`}>
          <Story>
            <Button size={size}>Test</Button>
          </Story>
          <Story>
            <Button size={size} SuffixIcon={HiMiniArrowRight}>
              Create a Covenant
            </Button>
          </Story>
          <Story>
            <Button size={size} SuffixIcon={HiMiniArrowRight} />
          </Story>
          <Story>
            <Button size={size} variant="secondary">
              Test
            </Button>
          </Story>
          <Story>
            <Button
              size={size}
              variant="secondary"
              PrefixIcon={HiMiniArrowLeft}
            >
              Go Back
            </Button>
          </Story>
          <Story>
            <Button
              size={size}
              variant="secondary"
              PrefixIcon={HiMiniArrowLeft}
            />
          </Story>

          <Story>
            <Button size={size} disabled>
              Test
            </Button>
          </Story>
          <Story>
            <Button size={size} SuffixIcon={HiMiniArrowRight} disabled>
              Test
            </Button>
          </Story>
          <Story>
            <Button size={size} SuffixIcon={HiMiniArrowRight} isLoading>
              Test
            </Button>
          </Story>

          <Story>
            <Button variant="ghost" size={size}>
              Test
            </Button>
          </Story>
          <Story>
            <Button SuffixIcon={HiMiniArrowRight} variant="ghost" size={size} />
          </Story>
        </div>
      ))}

      <p>Todos: CTA button</p>
    </Section>
  );
};

export default Buttons;
