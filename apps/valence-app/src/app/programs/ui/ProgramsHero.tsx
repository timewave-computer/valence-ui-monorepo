import { ValenceProductBrand } from "@/components";
import { Button } from "@valence-ui/ui-components";
import Image from "next/image";
import Link from "next/link";
import { HiMiniArrowRight } from "react-icons/hi2";

export function ProgramsHero() {
  return (
    <>
      <ValenceProductBrand
        img={
          <Image
            priority={true}
            className="max-h-24 w-auto"
            src="/img/auctions.svg"
            alt="Programs illustration"
            width={134}
            height={126}
          />
        }
      >
        <h1 className="text-2xl font-bold">Programs (beta)</h1>
        <p className="w-full max-w-lg text-pretty pt-1">
          Programs enable crosschain automation.
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
    label: "Read more",
    href: "https://github.com/timewave-computer/valence-services/tree/main/contracts/auction/auction",
  },
  {
    label: "Documentation",
    href: "https://github.com/timewave-computer/valence-services/tree/main/contracts/auction/auction",
  },
  {
    label: "Smart contracts",
    href: "https://github.com/timewave-computer/valence-services/tree/main/contracts",
  },
];
