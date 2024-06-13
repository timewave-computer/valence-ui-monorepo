import { Button, Footer } from "@/components";
import { LinkText } from "@/components/LinkText";
import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";

const HomePage = () => {
  return (
    <main className="h-screen grow overflow-auto bg-valence-white px-4 pt-8 text-valence-black transition-[padding]">
      <div className="mx-auto flex max-w-5xl flex-col">
        <div className="hidden flex-col items-center self-start px-4 pb-8 md:flex">
          <Image
            src="/img/valence_vertical.svg"
            alt="Logo"
            width={120}
            height={92}
          />
        </div>

        <div className="flex flex-col gap-x-10  md:grid md:grid-cols-2">
          <h2 className="col-start-1 row-start-1 border-black  px-4 font-bold md:border-t md:pt-4">
            Covenants
          </h2>
          <p className="col-start-1 row-start-2 p-4 pt-2">
            Covenants enable trust-minimized agreements between crypto-native
            organizations. Use Covenants to lend protocol-owned assets to other
            protocols for a fee or create protocol-to-protocol liquidity sharing
            agreements. Covenants improve execution quality and strengthen
            economic integration between token communities.
          </p>
          <Button
            className="col-start-1 row-start-3 mx-4 w-fit transition-all hover:bg-valence-black hover:text-valence-white"
            variant="secondary"
            asChild
          >
            <LinkText
              className="mt-2 flex flex-row items-center gap-1.5 self-start"
              href="/covenants"
            >
              Create a Covenant
              <HiMiniArrowRight className="h-4 w-4" />
            </LinkText>
          </Button>
          <Image
            src="/img/covenant.svg"
            alt="Covenant illustration"
            className="col-start-1 row-start-4 mt-12 flex grow px-4   md:self-end"
            width={220}
            height={140}
          />
          <div className=" col-start-1 row-start-5 mt-12 border-b border-black" />

          <h2 className="col-start-2 row-start-1 border-black px-4 pt-4 font-bold md:border-t">
            Rebalancer
          </h2>
          <p className="col-start-2 row-start-2 p-4 pt-2">
            The Rebalancer enables automated balance sheet and treasury
            management. Use the Rebalancer to efficiently convert tokens for
            scheduled payments or manage your digital organization’s asset
            portfolio. The Rebalancer is custom-built to address the needs of
            blockchains, protocols, and decentralized autonomous organizations.
          </p>

          <Button
            className="col-start-2 row-start-3 mx-4 w-fit transition-all hover:bg-valence-black hover:text-valence-white "
            variant="secondary"
            asChild
          >
            <LinkText
              className="mt-2 flex flex-row items-center gap-1.5 self-start"
              href="/rebalancer"
            >
              Rebalance Assets
              <HiMiniArrowRight className="h-4 w-4" />
            </LinkText>
          </Button>
          <Image
            src="/img/rebalancer.svg"
            alt="Rebalancer illustration"
            className="col-start-2 row-start-4 mt-12 flex grow border-b-black px-4  md:self-end"
            width={280}
            height={130}
          />
          <div className=" col-start-2 row-start-5 mt-12 border-b border-black" />
        </div>

        <div className="flex flex-col gap-x-10 border-b  border-valence-black md:flex-row  ">
          <div className="flex grow basis-0 flex-col justify-between md:gap-20">
            <h2 className="px-6 py-8 font-serif text-[3rem] leading-[0.9] md:text-[4.5rem]">
              Creating tools for crypto-native institutions
            </h2>

            <Image
              src="/img/hero.svg"
              alt="Valence illustration"
              width={140}
              height={140}
              className="mb-10 self-center md:hidden"
            />

            <div className="flex flex-col  border-t border-valence-black px-4 pb-16 pt-8">
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
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
