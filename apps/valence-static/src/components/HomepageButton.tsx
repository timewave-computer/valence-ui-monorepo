import { Button, ButtonProps, cn } from "@valence-ui/ui-components";

export const HomepageButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      iconStyle={{
        strokeWidth: 1,
      }}
      className={cn(className, "font-medium px-4 py-2 rounded-sm")}
      {...props}
    >
      {children}
    </Button>
  );
};
