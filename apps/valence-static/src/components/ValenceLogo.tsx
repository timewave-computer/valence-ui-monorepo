import Image from "next/image";
import { cn, Heading } from "@valence-ui/ui-components";

export const ValenceLogo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-2 w-fit h-fit",
        className,
      )}
    >
      <div className=" h-full min-w-6 flex flex-col  justify-center">
        <Image
          priority={true}
          className=""
          src="/img/valence_logo.svg"
          alt="Logo"
          width={36}
          height={36}
        />
      </div>
      <Heading level="h1" className="font-mono font-normal">
        valence
      </Heading>
    </div>
  );
};
