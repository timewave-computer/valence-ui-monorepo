"use client";

import { Button, TextInput } from "@/components";
import { ButtonLink } from "@/components/ButtonLink";
import { useState } from "react";
import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";

const HomePage = () => {
  const [email, setEmail] = useState("");

  return (
    <main className="grow h-screen overflow-auto bg-valence-white text-valence-black px-4 pt-8 transition-[padding]">
      <div className="max-w-5xl mx-auto flex flex-col">
        <div className="pb-8 px-4 flex flex-col items-center self-start">
          <Image src="/img/valence_vertical.svg" alt="Logo" width={120} height={92} />
        </div>

        <div className="flex flex-col md:flex-row gap-x-10">
          <div className="border-y border-valence-black px-4 pt-4 pb-12 flex flex-col basis-0 grow">
            <h2 className="font-bold">Covenant</h2>

            <p className="mt-2">
              Covenants are interchain agreements. Permissionless digital
              institutions that enable humanity to collaborate with
              unprecedented scope and scale.
            </p>

            <ButtonLink
              style="secondary"
              className="mt-6 self-start flex flex-row items-center gap-1.5"
              href="/covenant"
            >
              Create a Covenant
              <HiMiniArrowRight className="w-4 h-4" />
            </ButtonLink>

            <Image
              src="/img/covenant.svg"
              alt="Covenant illustration"
              className="mt-12"
              width={220}
              height={140}
            />
          </div>

          <div className="border-b md:border-t border-valence-black px-4 pt-4 pb-12 flex flex-col basis-0 grow">
            <h2 className="font-bold">Rebalancer</h2>

            <p className="mt-2">
              Rebalancer is automated portfolio management. All who endeavor to
              grow the interchain are limited only by their imaginations and the
              laws of physics, not by tooling or resources.
            </p>

            <ButtonLink
              style="secondary"
              className="mt-6 self-start flex flex-row items-center gap-1.5"
              href="/rebalancer"
            >
              Rebalance portfolio
              <HiMiniArrowRight className="w-4 h-4" />
            </ButtonLink>

            <Image
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              className="mt-12"
              width={220}
              height={130}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-x-10">
          <div className="flex flex-col justify-between md:gap-20 basis-0 grow">
            <h2 className="px-6 py-8 text-[3rem] sm:text-[4.5rem] font-serif leading-[0.9]">
              Creates tools for internet-native institutions
            </h2>

            <Image
              src="/img/hero.svg"
              alt="Valence illustration"
              width={140}
              height={140}
              className="mb-10 self-center md:hidden"
            />

            <div className="border-y border-valence-black px-4 pt-8 pb-16 flex flex-col">
              <h2 className="font-bold">Interchain Guild</h2>

              <p className="mt-2">
                Free and open source software is the foundation of
                internet-native institutions. Valence develops the interchain
                guild to support essential public goods infrastructure.
              </p>

              <ButtonLink
                style="secondary"
                className="mt-6 self-start flex flex-row items-center gap-1.5"
                href="https://google.com"
              >
                Fund public goods
                <HiMiniArrowRight className="w-4 h-4" />
              </ButtonLink>

              <Image
                src="/img/interchain_guild.svg"
                alt="Interchain Guild illustration"
                className="mt-12"
                width={310}
                height={148}
              />
            </div>
          </div>

          <div className="flex-col items-center basis-0 grow hidden md:flex">
            <Image
              className="m-8"
              src="/img/hero.svg"
              alt="Valence illustration"
              width={345}
              height={653}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-x-10 text-sm">
          <div className="p-4 flex flex-col justify-between gap-y-10 basis-0 grow">
            <div className="flex flex-col gap-4">
              <h3>Timewave</h3>

              <p>
                We architect institutions to bring long-term alignment across
                the interchain.
              </p>

              <p>timewave.computer</p>
            </div>

            <p>2024</p>
          </div>

          <div className="border-b md:border-t md:border-b-0 border-valence-black p-4 flex flex-col justify-between basis-0 grow gap-4">
            <div className="flex flex-col gap-4">
              <p>Sign up for newsletter</p>

              <div className="flex flex-row items-stretch">
                <TextInput
                  input={email}
                  onChange={setEmail}
                  containerClassName="!border-valence-black border-r-0 w-full max-w-xs"
                />

                <Button style="secondary" onClick={() => {}}>
                  Subscribe
                </Button>
              </div>
            </div>

            <p>hello at timewave.computer</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
