"use client";
import { Button, cn, TextInput } from "@valence-ui/ui-components";
import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { X_URL, GITHUB_URL, DOCS_URL } from "@valence-ui/socials";
import { VALENCE_DESCRIPTION } from "~/const";
import { submitSubscribe } from "~/server/actions/submit-subscribe";

export const Footer = (
  { className }: { className?: string } = { className: "" },
) => {
  const [email, setEmail] = useState("");
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [showSubmitError, setShowSubmitError] = useState(false);

  const subscribeMutation = useMutation({
    mutationKey: ["subscribe", email],
    mutationFn: () => submitSubscribe(email),
    onMutate: () => {
      setShowSubmitError(false);
      setEmail("");
      setShowSubscribe(false);
    },
    onError: () => {
      setShowSubscribe(true);
      setShowSubmitError(true);
    },
  });

  return (
    <footer
      className={cn(
        "mx-auto border-t w-full border-valence-black max-w-5xl px-4 pt-4 mt-4 pb-8 flex flex-col gap-x-10 gap-y-5 text-sm md:grid md:grid-cols-2",
        className,
      )}
    >
      <Link href={"/"}>
        <Image
          className="col-span-1 col-start-1   flex-col justify-between"
          src="/img/valence_horizontal.svg"
          alt="Valence illustration"
          width={110}
          height={38}
        />
      </Link>
      <div className="col-span-1  col-start-1 justify-between">
        <div className="flex flex-col gap-4">
          <p>{VALENCE_DESCRIPTION}</p>
        </div>
      </div>

      <div className="col-span-1 col-start-1 flex flex-col gap-2">
        {showSubscribe ? (
          <>
            {" "}
            <p>Sign up for our newsletter</p>
            <div className="flex flex-row items-stretch">
              <TextInput
                id="email"
                input={email}
                onChange={setEmail}
                containerClassName="!border-valence-black border-r-0 w-full max-w-xs"
              />
              <Button
                variant="secondary"
                onClick={() => {
                  subscribeMutation.mutate();
                }}
              >
                Subscribe
              </Button>
            </div>
            {showSubmitError && (
              <div className="text-valence-red">
                Failed to submit email. Please try again later
              </div>
            )}
          </>
        ) : (
          <p>Subscribed!</p>
        )}
      </div>

      <div className="col-span-1 col-start-2 row-start-2 flex flex-col gap-2 ">
        <a
          href={X_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          twitter
        </a>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          github
        </a>
        <Link className="hover:underline" href="/blog">
          blog
        </Link>
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          documentation
        </a>
      </div>
      <div className=" col-span-1 col-start-2 row-start-3 self-start  md:self-end">
        <p>© 2024 Timewave </p>
      </div>
    </footer>
  );
};
