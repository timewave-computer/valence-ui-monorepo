import { Button, ValenceProductBrand } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { HiMiniArrowRight } from "react-icons/hi2";

export function LiveAuctionsHero() {
  return (
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
      <p className="max-w-lg text-pretty pt-1">
        Dutch auctions to enable trades for accounts using the{" "}
        <Link
          className="font-semibold hover:border-b-[1.6px] hover:border-valence-black"
          href="/rebalancer"
        >
          Rebalancer
        </Link>
        . Auctions begin at 12:00 UTC daily, and close after 24 hours.
      </p>
      <div className="flex flex-row gap-4 pt-2">
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
    href: "",
  },
  {
    label: "How to sell",
    href: "",
  },
];
