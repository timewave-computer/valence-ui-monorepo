"use client";

import { Button, TextInput } from "@/components";
import { ButtonLink } from "@/components/ButtonLink";
import { useState } from "react";
import { PiArrowRight } from "react-icons/pi";
import Image from "next/image";

const HomePage = () => {
  const [email, setEmail] = useState("");

  return (
    <main className="flex grow h-screen overflow-auto flex-col bg-white text-black p-6 sm:p-10 md:p-16 !pb-0 transition-[padding]">
      <div className="pb-10 px-6 flex flex-col items-center self-start">
        <Image
          src="/img/valence.png"
          alt="Logo"
          width={40}
          height={55}
        />

        <h1 className="text-4xl font-serif">Valence</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-x-10">
        <div className="border-y border-black px-6 py-8 flex flex-col basis-0 grow">
          <h2 className="text-lg font-bold">Covenant</h2>

          <p className="mt-2">
            Covenants are interchain agreements. Permissionless digital
            institutions that enable humanity to collaborate with unprecedented
            scope and scale.
          </p>

          <ButtonLink
            style="secondary"
            className="mt-6 self-start flex flex-row items-center gap-1.5"
            href="/covenant"
          >
            Create a covenant
            <PiArrowRight className="w-5 h-5" />
          </ButtonLink>

          <Image
            src="/img/covenant.png"
            alt="Covenant illustration"
            className="mt-8"
            width={220}
            height={140}
          />
        </div>

        <div className="border-b md:border-t border-black px-6 py-8 flex flex-col basis-0 grow">
          <h2 className="text-lg font-bold">Rebalancer</h2>

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
            <PiArrowRight className="w-5 h-5" />
          </ButtonLink>

          <Image
            src="/img/rebalancer.png"
            alt="Rebalancer illustration"
            className="mt-8"
            width={220}
            height={130}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col justify-between md:gap-20 basis-0 shrink-0 min-w-[calc(50%+1.25rem)]">
          <h2 className="px-6 py-8 text-[3rem] md:text-[4rem] self-end font-serif leading-[3.6rem]">
            Create tools for internet-native institutions
          </h2>

          <Image
            src="/img/valence_home.png"
            alt="Rebalancer illustration"
            width={140}
            height={140}
            className="mb-10 self-center md:hidden"
          />

          <div className="border-y border-black px-6 py-8 flex flex-col md:mr-10">
            <h2 className="text-lg font-bold">Interchain Guild</h2>

            <p className="mt-2">
              Free and open source software is the foundation of internet-native
              institutions. Valence develops the interchain guild to support
              essential public goods infrastructure.
            </p>

            <ButtonLink
              style="secondary"
              className="mt-6 self-start flex flex-row items-center gap-1.5"
              href="https://google.com"
            >
              Fund public goods
              <PiArrowRight className="w-5 h-5" />
            </ButtonLink>
          </div>
        </div>

        <div className="px-8 py-16 flex-col items-center basis-0 grow hidden md:flex">
          <Image
            src="/img/valence_home.png"
            alt="Rebalancer illustration"
            width={250}
            height={486}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-x-10">
        <div className="px-6 py-8 flex flex-col justify-between gap-y-24 basis-0 grow">
          <div className="flex flex-col gap-4">
            <h3>Timewave</h3>

            <p>
              We architect institutions to bring long-term alignment across the
              interchain.
            </p>

            <p>timewave.computer</p>
          </div>

          <p>2023</p>
        </div>

        <div className="border-b md:border-t md:border-b-0 border-black px-6 py-8 flex flex-col justify-between basis-0 grow gap-4">
          <div className="flex flex-col gap-4">
            <p>Sign up for newsletter</p>

            <div className="flex flex-row items-stretch">
              <TextInput
                input={email}
                onChange={setEmail}
                noIcon
                containerClassName="!border-black border-r-0 w-full max-w-xs"
              />

              <Button style="secondary" onClick={() => {}}>
                Subscribe
              </Button>
            </div>
          </div>

          <p>hello at timewave.computer</p>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
