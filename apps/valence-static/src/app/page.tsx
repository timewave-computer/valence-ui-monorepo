import { Button, cn } from "@valence-ui/ui-components";
import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { VALENCE_APP_URL } from "~/const";

const Hero = ({ className }: { className?: string }) => {
  return (
    <>
      <h2
        className={cn(
          "text-balance px-4 md:px-0  font-serif text-[2.5rem] leading-[0.9]  md:text-[4.7rem]",
          className,
        )}
      >
        Tools for long-term, permissionless collaboration
      </h2>

      <Image
        src="/img/hero.svg"
        alt="Valence illustration"
        width={140}
        height={140}
        className="mb-10 self-center md:hidden"
      />
    </>
  );
};

const InterchainGuild = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col  border-valence-black py-4 md:border-t md:pb-16",
        className,
      )}
    >
      <h2 className="text-h3 font-semibold px-4 md:px-0">Interchain Guild</h2>

      <p className="mb-4 mt-2 px-4 md:px-0 ">
        Free and open source software is the foundation of crypto-native
        institutions. Valence develops the Interchain Guild to support essential
        public goods infrastructure.
      </p>
      <div className="px-4 md:px-0">
        <Button variant="secondary" disabled>
          Coming soon
        </Button>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <main className=" grow  bg-valence-white  pb-4  text-valence-black transition-[padding]">
      <div className="mx-auto flex max-w-5xl flex-col">
        {/* on mobile this should show at the top, on desktop it is in the center of the layout */}
        <div
          className="mb-4 flex grow basis-0 flex-col justify-between gap-4
         md:mb-8 pt-4  md:hidden
        "
        >
          <Hero className="" />
        </div>

        <div className="flex flex-col gap-x-10  border-valence-black  border-t md:border-0   md:grid md:grid-cols-2">
          <h2 className="col-start-1 row-start-1 px-4 md:px-0  text-h3 font-semibold  pt-4">
            Covenants
          </h2>
          <p className="col-start-1 row-start-2 py-4 pt-2 px-4 md:px-0">
            Covenants enable trust-minimized agreements between crypto-native
            organizations. Use Covenants to lend protocol-owned assets to other
            protocols for a fee or create protocol-to-protocol liquidity sharing
            agreements. Covenants improve execution quality and strengthen
            economic integration between token communities.
          </p>
          <div className="col-start-1 row-start-3  flex flex-row flex-wrap gap-4 px-4 md:px-0 ">
            <a target="_blank" href={`${VALENCE_APP_URL}/covenants`}>
              <Button
                className="flex w-fit flex-row justify-center gap-1"
                variant="primary"
              >
                Create a Covenant
                <HiMiniArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/blog/Covenants_Protocol-to-Protocol_Deals">
              <Button
                className="flex w-fit flex-row justify-center gap-1"
                variant="secondary"
              >
                Read more
                <HiMiniArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Image
            src="/img/covenant.svg"
            alt="Covenant illustration"
            className="col-start-1 row-start-4 mt-12 flex grow px-4   md:self-end"
            width={220}
            height={140}
          />
          <div className=" col-start-1 row-start-5 mt-12 border-b border-black" />

          <h2 className="col-start-2 row-start-1 px-4 md:px-0 border-valence-black   pt-4 text-h3 font-semibold ">
            Rebalancer
          </h2>
          <p className="col-start-2 row-start-2 py-4 pt-2 px-4 md:px-0">
            The Rebalancer enables automated balance sheet and treasury
            management. Use the Rebalancer to efficiently convert tokens for
            scheduled payments or manage your digital organization’s asset
            portfolio. The Rebalancer is custom-built to address the needs of
            blockchains, protocols, and decentralized autonomous organizations.
          </p>
          <div className="col-start-2 row-start-3  flex flex-row flex-wrap gap-4 px-4 md:px-0 ">
            <a target="_blank" href={`${VALENCE_APP_URL}/rebalancer`}>
              <Button
                className="flex w-fit flex-row justify-center gap-1"
                variant="primary"
              >
                Rebalance Assets
                <HiMiniArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <Link href="/blog/Rebalancer-Protocol-Asset-Management">
              <Button
                className="flex w-fit flex-row justify-center gap-1"
                variant="secondary"
              >
                Read more
                <HiMiniArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Image
            priority
            src="/img/rebalancer.svg"
            alt="Rebalancer illustration"
            className="col-start-2 row-start-4 mt-12 flex grow border-b-black px-4  md:self-end"
            width={280}
            height={130}
          />
          <div className=" col-start-2 row-start-5 mt-12 border-b border-black" />
        </div>

        <div className="flex flex-col gap-x-10   md:flex-row  ">
          {/* only for desktop. rendered in column below for mobile */}
          <div className="hidden grow basis-0 flex-col justify-between md:flex md:gap-20">
            <Hero className=" py-8 " />
            <InterchainGuild />
          </div>

          <div className="hidden grow basis-0 flex-col items-center md:flex">
            <Image
              priority
              className="m-8"
              src="/img/hero.svg"
              alt="Valence illustration"
              width={345}
              height={653}
            />
          </div>
        </div>
        {/* rendered in different part of the layout for mobile */}
        <InterchainGuild className=" md:hidden" />
      </div>
    </main>
  );
};

export default HomePage;
