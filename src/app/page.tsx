"use client";

import { Button, TextInput } from "@/components";
import { LinkText } from "@/components/LinkText";
import { useState } from "react";
import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { submitSubscribe } from "@/server/actions/submit-subscribe";

const HomePage = () => {
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
    <main className="h-screen grow overflow-auto bg-valence-white px-4 pt-8 text-valence-black transition-[padding]">
      <div className="mx-auto flex max-w-5xl flex-col">
        <div className="flex flex-col items-center self-start px-4 pb-8">
          <Image
            src="/img/valence_vertical.svg"
            alt="Logo"
            width={120}
            height={92}
          />
        </div>

        <div className="flex flex-col gap-x-10 md:flex-row">
          <div className="flex grow basis-0 flex-col border-y border-valence-black px-4 pb-12 pt-4">
            <h2 className="font-bold">Covenant</h2>

            <p className="mt-2">
              Covenants enable trust minimized agreements among digital
              organizations across any chain. Lend protocol-owned assets to
              other protocols for a fee, or create protocol-to-protocol
              liquidity sharing agreements to jointly improve execution quality
              and strengthen economic integration between two token communities.
            </p>

            <Button variant="secondary" asChild>
              <LinkText
                className="mt-6 flex flex-row items-center gap-1.5 self-start"
                href="/covenant"
              >
                Create a Covenant
                <HiMiniArrowRight className="h-4 w-4" />
              </LinkText>
            </Button>

            {/* Spacing */}
            <div className="grow"></div>

            <Image
              src="/img/covenant.svg"
              alt="Covenant illustration"
              className="mt-12"
              width={220}
              height={140}
            />
          </div>

          <div className="flex grow basis-0 flex-col border-b border-valence-black px-4 pb-12 pt-4 md:border-t">
            <h2 className="font-bold">Rebalancer</h2>

            <p className="mt-2">
              The Rebalancer enables automated balance sheet and treasury
              management for any blockchains, protocols, and decentralized
              applications. Use the Rebalancer to efficiently convert tokens for
              scheduled payments or manage your digital organization&apos;s
              asset portfolio.
            </p>

            <Button variant="secondary" asChild>
              <LinkText
                className="mt-6 flex flex-row items-center gap-1.5 self-start"
                href="/rebalancer"
              >
                Rebalance Assets
                <HiMiniArrowRight className="h-4 w-4" />
              </LinkText>
            </Button>

            {/* Spacing */}
            <div className="grow"></div>

            <Image
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              className="mt-12"
              width={220}
              height={130}
            />
          </div>
        </div>

        <div className="flex flex-col gap-x-10 md:flex-row">
          <div className="flex grow basis-0 flex-col justify-between md:gap-20">
            <h2 className="px-6 py-8 font-serif text-[3rem] leading-[0.9] sm:text-[4.5rem]">
              Creating tools for crypto-native institutions
            </h2>

            <Image
              src="/img/hero.svg"
              alt="Valence illustration"
              width={140}
              height={140}
              className="mb-10 self-center md:hidden"
            />

            <div className="flex flex-col border-y border-valence-black px-4 pb-16 pt-8">
              <h2 className="font-bold">Interchain Guild</h2>

              <p className="mt-2">
                Free and open source software is the foundation of crypto-native
                institutions. Valence develops the Interchain Guild to support
                essential public goods infrastructure.
              </p>

              <Button variant="secondary" asChild disabled>
                <LinkText
                  className="mt-6 flex flex-row items-center gap-1.5 self-start"
                  href=""
                >
                  Coming soon
                </LinkText>
              </Button>
            </div>
          </div>

          <div className="hidden grow basis-0 flex-col items-center md:flex">
            <Image
              className="m-8"
              src="/img/hero.svg"
              alt="Valence illustration"
              width={345}
              height={653}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-x-10 text-sm md:flex-row">
          <div className="flex grow basis-0 flex-col justify-between gap-y-10 p-4">
            <div className="flex flex-col gap-4">
              <p>
                Timewave increases the scope and scale of interoperability
                between crypto-native organizations.
              </p>

              <a
                href="https://twitter.com/timewavelabs"
                target="_blank"
                rel="noreferrer"
              >
                @timewavelabs
              </a>
            </div>

            <p>2024</p>
          </div>

          <div className="flex grow basis-0 flex-col justify-between gap-4 border-b border-valence-black p-4 md:border-b-0 md:border-t">
            <div className="flex flex-col gap-4">
              {showSubscribe ? (
                <>
                  {" "}
                  <p>Sign up for our newsletter</p>
                  <div className="flex flex-row items-stretch">
                    <TextInput
                      input={email}
                      onChange={setEmail}
                      containerClassName="!border-valence-black border-r-0 w-full max-w-xs"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        console.log("submitting", email);
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

            <p>hello at timewave.computer</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
