"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex grow flex-col items-center bg-valence-white  ">
      <div className="flex-1 "></div>{" "}
      {/* This div will take up 1/4 of the space */}
      <div className="flex flex-[3] flex-col items-center p-6 text-center">
        {" "}
        {/* This div will take up 3/4 of the space */}
        <Image
          src="/img/hero.svg"
          alt="Valence illustration"
          width={140}
          height={140}
          className="mb-10 self-center"
        />
        <h2 className="font-mono text-2xl text-valence-black ">
          Sorry, something went wrong.
        </h2>
        <button
          className="pt-2 font-mono text-valence-blue hover:underline"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => {
              router.refresh();
              reset();
            }
          }
        >
          Try a refresh?
        </button>
      </div>
    </div>
  );
}
