import { Button, ValenceProductBrand } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { HiMiniArrowRight } from "react-icons/hi2";

export function LiveAuctionsHero() {
  return (
    <>
      <ValenceProductBrand
        img={
          <Image
            className="max-h-24 w-auto"
            src="/img/auctions.svg"
            alt="Auctions illustration"
            width={134}
            height={126}
          />
        }
      >
        <h1 className="text-2xl font-bold">Auctions (beta)</h1>
        <p className="w-full max-w-lg text-pretty pt-1">
          Dutch auctions which enable trades for accounts using the{" "}
          <Link
            className="font-semibold hover:border-b-[1.6px] hover:border-valence-black"
            href="/rebalancer"
          >
            Rebalancer
          </Link>
          . Auction cycles begin at 00:00 UTC daily.
        </p>
        <div className="hidden flex-row flex-wrap gap-4 pt-4 sm:flex">
          {heroLinks.map((link) => (
            <Link
              key={`hero-link-${link.label}`}
              target="_blank"
              href={link.href}
            >
              <Button
                className="flex w-fit flex-row justify-center gap-1"
                variant="secondary"
              >
                {link.label}
                <HiMiniArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      </ValenceProductBrand>
      <div className=" flex flex-row flex-wrap gap-4 pt-2 sm:hidden">
        {heroLinks.map((link) => (
          <Link
            key={`hero-link-${link.label}`}
            target="_blank"
            href={link.href}
          >
            <Button
              className="flex w-fit flex-row justify-center gap-1"
              variant="secondary"
            >
              {link.label}
              <HiMiniArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
}
const heroLinks: { href: string; label: string }[] = [
  {
    label: "Documentation",
    href: "https://github.com/timewave-computer/valence-services/tree/main/contracts/auction/auction",
  },
  {
    label: "Smart contracts",
    href: "https://github.com/timewave-computer/valence-services/tree/main/contracts",
  },
  {
    label: "How to bid",
    href: "https://github.com/timewave-computer/valence-services/tree/main/contracts/auction/auction#doing-a-bid",
  },
  {
    label: "How to sell",
    href: "https://github.com/timewave-computer/valence-services/tree/main/contracts/auction/auction#selling-funds",
  },
];
