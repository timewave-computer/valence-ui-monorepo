import { Button } from "@/components";
import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <>
      <main className="h-screen grow overflow-auto bg-valence-white px-4 pt-8 text-valence-black transition-[padding]">
        <div className="mx-auto flex max-w-5xl flex-col">
          <h2
            className={
              "text-balance px-6  font-serif text-[3rem] md:text-[4.7rem] pb-8 leading-[0.9]"
            }
          >
            Tools for long-term, permissionless collaboration
          </h2>

          <div className="flex flex-col gap-x-10  md:grid md:grid-cols-2">
            <h2 className="col-start-1 row-start-1 border-black  px-4 text-lg font-semibold">
              Covenants
            </h2>
            <p className="col-start-1 row-start-2 p-4 pt-2">
              Covenants enable trust-minimized agreements between crypto-native
              organizations. Use Covenants to lend protocol-owned assets to
              other protocols for a fee or create protocol-to-protocol liquidity
              sharing agreements. Covenants improve execution quality and
              strengthen economic integration between token communities.
            </p>
            <div className="col-start-1 row-start-3 mx-4 flex flex-row flex-wrap gap-4 ">
              <Link href={`/covenants`}>
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="primary"
                >
                  Create a Covenant
                  <HiMiniArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog/Covenants_Protocol-to-Protocol_Deals">
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="secondary"
                >
                  Learn more
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
          </div>
          <div className=" mt-12  border-black">
            <h2 className="col-start-2 row-start-2 border-black px-4 pt-4 text-lg font-semibold ">
              Rebalancer
            </h2>
            <p className="col-start-2 row-start-2 p-4 pt-2">
              The Rebalancer enables automated balance sheet and treasury
              management. Use the Rebalancer to efficiently convert tokens for
              scheduled payments or manage your digital organization’s asset
              portfolio. The Rebalancer is custom-built to address the needs of
              blockchains, protocols, and decentralized autonomous
              organizations.
            </p>
            <div className="col-start-2 row-start-3 mx-4 flex flex-row flex-wrap gap-4 ">
              <Link href="/rebalancer">
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="primary"
                >
                  Rebalance Assets
                  <HiMiniArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/auctions">
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="secondary"
                >
                  Auctions
                  <HiMiniArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/blog/Rebalancer-Protocol-Asset-Management">
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="secondary"
                >
                  Learn more
                  <HiMiniArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Image
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              className="col-start-2 row-start-4 mt-12 flex grow  px-4  md:self-end"
              width={280}
              height={130}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
