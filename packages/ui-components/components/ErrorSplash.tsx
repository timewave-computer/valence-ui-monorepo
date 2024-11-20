"use client";

import { useEffect } from "react";

export function ErrorSplash({
  error,
  children,
  onRefresh,
  showErrorMsg = false,
}: {
  onRefresh: () => void;
  error: Error & { digest?: string };
  children: React.ReactNode;
  showErrorMsg?: boolean;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex grow flex-col items-center bg-valence-white  ">
      <div className="flex-1 "></div>{" "}
      {/* This div will take up 1/4 of the space */}
      <div className="flex-[3] flex flex-col items-center p-6 text-center w-full">
        {/* This div will take up 3/4 of the space */}
        {children}
        {error?.message && showErrorMsg && (
          <p className="font-mono  text-xs mb-6 mt-2 bg-valence-lightgray text-valence-black p-4">
            Error: {error.message}
          </p>
        )}
        <button
          className="pt-2 font-mono text-valence-blue hover:underline"
          onClick={onRefresh}
        >
          Try a refresh?
        </button>
      </div>
    </div>
  );
}
