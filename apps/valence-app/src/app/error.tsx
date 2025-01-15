"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ErrorSplash } from "@valence-ui/ui-components";

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
    <>
      <ErrorSplash
        showErrorMsg={true}
        error={error}
        onRefresh={() => {
          router.refresh();
          reset();
        }}
      >
        <Image
          src="/img/hero.svg"
          alt="Valence illustration"
          width={140}
          height={140}
          className="mb-10 self-center"
        />
        <h2 className="font-mono text-h4 text-valence-black ">
          Something went wrong.
        </h2>
      </ErrorSplash>
    </>
  );
}
