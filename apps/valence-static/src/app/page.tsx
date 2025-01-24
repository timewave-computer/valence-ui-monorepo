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
              SuffixIcon={HiMiniArrowRight}
            >
              Get Started
            </Button>
          }
          headline="The Universal DeFi Computer"
          Img={
            <Image
              priority
              src="/img/valence_homepage_graphic.svg"
              alt={"Valence Graphic"}
              width={300}
              height={200}
            />
          }
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

        <div className="col-span-full h-[1px] border-b border-valence-black "></div>
        <HomepageSection
          imgFirst
          cta={
            <Button
              link={{
                href: VAULTS_URL,
                blankTarget: true,
              }}
              SuffixIcon={HiMiniArrowRight}
            >
              Try x-vaults
            </Button>
          }
          headline="x-vaults"
          Img={
            <Image
              priority
              src="/img/x_vault_graphic.svg"
              alt="X Vaults Graphic"
              width={300}
              height={200}
            />
          }
        >
          <p className="text-balance">
            Onboard liquidity from any chain. Deploy liquidity to any ecosystem.
          </p>
          <p className="text-balance">
            x-vaults are a programmable interoperability primitive for building
            secure cross-chain asset flows.
          </p>
        </HomepageSection>

        <div className="col-span-full h-[1px] border-b border-valence-black "></div>

        <HomepageSection
          headline="Valence Programs"
          Img={
            <Image
              priority
              src="/img/valence_program_graphic.svg"
              alt="Valence Graphic"
              width={300}
              height={200}
            />
          }
          cta={
            <Button
              link={{
                href: DOCS_URL,
                blankTarget: true,
              }}
              SuffixIcon={HiMiniArrowRight}
            >
              Learn more
            </Button>
          }
        >
          <p className="text-balance">
            Valence provides a unified development environment for writing
            cross-chain programs.
          </p>
          <p className="text-balance">
            Abstract over EVM, SVM, WASM, Move and compile programs to sovereign
            ZK co-processors on any chain.
          </p>
        </HomepageSection>
      </div>
    </main>
  );
};

const HomepageSection = ({
  children,
  className,
  headline,
  cta,
  imgFirst = false,
  Img,
}: {
  children: React.ReactNode;
  className?: string;
  headline: string;
  cta: React.ReactNode;
  Img: React.ReactNode;
  imgFirst?: boolean;
}) => {
  const ImageComponent = () => (
    <div className="hidden md:flex flex-col w-full items-center justify-center p-8 md:p-16  ">
      {Img}
    </div>
  );

  return (
    <>
      {imgFirst && <ImageComponent />}

      <div className="flex flex-col py-16 gap-4 p-8 md:p-16 justify-center">
        <Headline className="">{headline}</Headline>

        {children}
        {/* mobile Image */}
        <div className=" flex md:hidden flex-col w-full items-center justify-center p-8 md:p-16  ">
          {Img}
        </div>
        <div className="self-end px-8 md:px-0 md:pt-8 ">{cta}</div>
      </div>

      {!imgFirst && <ImageComponent />}
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
