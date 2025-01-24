import { Button, cn } from "@valence-ui/ui-components";
import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";
import { DOCS_URL, VAULTS_URL } from "@valence-ui/socials";

const HomePage = () => {
  return (
    <main className="mx-auto flex max-w-5xl flex-col">
      <div className="flex flex-col  gap-x-14   border-valence-black   md:grid md:grid-cols-2">
        <HomepageSection
          cta={
            <Button
              link={{
                href: DOCS_URL,
                blankTarget: true,
              }}
              className="self-end mt-8"
              SuffixIcon={HiMiniArrowRight}
            >
              Get Started
            </Button>
          }
          headline="The Universal DeFi Computer"
          imageUrl="/img/valence_homepage_graphic.svg"
        >
          <p className="text-balance">
            Valence is a unified stack for building secure cross-chain DeFi
            applications.
          </p>
          <p className="text-balance">
            Simple, expressive developer experience. Write, test, and deploy
            your first program in 15 minutes.
          </p>
        </HomepageSection>
        <div className="flex flex-col py-16 gap-4 px-8 md:px-16  justify-center">
          <Headline className="text-balance">
            The Universal DeFi Computer
          </Headline>
        </div>

        <div className="flex flex-col w-full items-center justify-center px-8 md:px-16   pb-4 pt-12">
          <Image
            priority
            src="/img/valence_homepage_graphic.svg"
            alt="Valence Homepage Graphic"
            width={360}
            height={200}
          />
        </div>
        <div className="col-span-full h-[1px] border-b border-valence-black "></div>

        <div className="flex flex-col w-full items-center justify-center px-8 md:px-16 py-16  ">
          <Image
            priority
            src="/img/x_vault_graphic.svg"
            alt="X Vaults Graphic"
            width={300}
            height={200}
          />
        </div>

        <div className="flex flex-col py-8 gap-4 px-8 md:px-16  justify-center">
          <Headline>x-vaults</Headline>

          <p className="text-balance">
            Onboard liquidity from any chain. Deploy liquidity to any ecosystem.
          </p>
          <p className="text-balance">
            x-vaults are a programmable interoperability primitive for building
            secure cross-chain asset flows.
          </p>
          <Button
            link={{
              href: VAULTS_URL,
              blankTarget: true,
            }}
            className="self-end mt-8"
            SuffixIcon={HiMiniArrowRight}
          >
            Try x-vaults
          </Button>
        </div>

        <div className="col-span-full h-[1px] border-b border-valence-black "></div>

        <div className="flex flex-col py-16 gap-4 px-8 md:px-16  justify-center">
          <Headline>Valence Programs</Headline>

          <p className="text-balance">
            Valence provides a unified development environment for writing
            cross-chain programs.
          </p>
          <p className="text-balance">
            Abstract over EVM, SVM, WASM, Move and compile programs to sovereign
            ZK co-processors on any chain.
          </p>
          <Button
            link={{
              href: DOCS_URL,
              blankTarget: true,
            }}
            className="self-end mt-8"
            SuffixIcon={HiMiniArrowRight}
          >
            Learn more
          </Button>
        </div>

        <div className="flex flex-col w-full items-center justify-center py-16 px-8 md:px-16 ">
          <Image
            priority
            src="/img/valence_program_graphic.svg"
            alt="Valence Graphic"
            width={300}
            height={200}
          />
        </div>
      </div>
    </main>
  );
};

const HomepageSection = ({
  children,
  className,
  imageUrl,
  headline,
  cta,
  imgFirst,
}: {
  children: React.ReactNode;
  className?: string;
  imageUrl: string;
  headline: string;
  cta: React.ReactNode;
  imgFirst?: boolean;
}) => {
  return (
    <>
      <div className="flex flex-col py-16 gap-4 px-8 md:px-16  justify-center">
        <Headline>{headline}</Headline>
        {children}
        {cta}
      </div>

      <div className="flex flex-col w-full items-center justify-center py-16 px-8 md:px-16 ">
        <Image
          priority
          src={imageUrl}
          alt={imageUrl}
          width={300}
          height={200}
        />
      </div>
    </>
  );
};

const Headline = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1
    className={cn("text-[2.027rem] leading-[3.04rem] font-semibold", className)}
  >
    {children}
  </h1>
);

export default HomePage;
