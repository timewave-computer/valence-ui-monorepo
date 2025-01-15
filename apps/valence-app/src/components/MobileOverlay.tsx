"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heading } from "@valence-ui/ui-components";

export const MobileOverlay = ({ text }: { text: string }) => {
  const router = useRouter();
  return (
    <div className="flex grow flex-col items-center bg-valence-white sm:hidden  ">
      <div className="flex-1 "></div>{" "}
      {/* This div will take up 1/4 of the space */}
      <div className="flex flex-[3] flex-col items-center p-6 text-center">
        {" "}
        {/* This div will take up 3/4 of the space */}
        <Image
          src="/img/hero.svg"
          alt="Valence illustration"
          width={80}
          height={80}
          className="mb-10 self-center"
        />
        <Heading level="h4">{text}</Heading>
        <p className="pt-4 font-mono ">Please visit from a computer.</p>
        <button
          className="pt-12 font-mono text-valence-blue hover:underline"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => {
              router.back();
            }
          }
        >
          Go back?
        </button>
      </div>
    </div>
  );
};
