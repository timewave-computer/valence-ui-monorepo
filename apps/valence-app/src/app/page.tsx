import { Button } from "@valence-ui/ui-components";
import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const HomePage = () => {
  // this will eventually be a high level dashboard board but for now we just default to covenants
  return redirect("/covenants");

  return (
    <>
      <main className="h-screen grow overflow-auto bg-valence-white px-4 pt-8 text-valence-black transition-[padding]">
        <div className="mx-auto flex max-w-5xl flex-col">
          <h2 className={"text-center font-serif text-4xl  pb-8"}>
            Valence Services
          </h2>

          <div className="flex flex-col gap-12 md:grid grid-cols-3 flex-wrap  items-center justify-center">
            <div className="flex flex-col gap-4 min-h-[300px] max-w-[360px] w-full justify-between border border-black p-4 ">
              <h2 className="   text-lg font-semibold">Covenants</h2>

              <Image
                src="/img/covenant.svg"
                alt="Covenant illustration"
                className=" "
                width={220}
                height={140}
              />
              <Link href={`/covenants`}>
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="primary"
                >
                  Create a Covenant
                  <HiMiniArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className=" flex flex-col gap-4 min-h-[300px] max-w-[360px] w-full justify-between border border-black p-4 ">
              <h2 className="col-start-2 row-start-2   text-lg font-semibold ">
                Rebalancer
              </h2>
              <Image
                src="/img/rebalancer.svg"
                alt="Rebalancer illustration"
                className=""
                width={280}
                height={130}
              />
              <Link href="/rebalancer">
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="primary"
                >
                  Rebalance Assets
                  <HiMiniArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className=" flex flex-col gap-4 min-h-[300px] max-w-[360px] w-full justify-between border border-black p-4 ">
              <h2 className="   text-lg font-semibold ">Auctions</h2>

              <Image
                src="/img/auctions.svg"
                alt="Rebalancer illustration"
                width={280}
                height={130}
              />

              <Link href={`/auctions`}>
                <Button
                  className="flex w-fit flex-row justify-center gap-1"
                  variant="primary"
                >
                  View Auctions
                  <HiMiniArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
