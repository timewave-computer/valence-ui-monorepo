import { HiMiniArrowRight } from "react-icons/hi2";
import Image from "next/image";
import { DOCS_URL, VAULTS_URL } from "@valence-ui/socials";
import { HomepageButton, HomepageHeadline } from "~/components";

const HomePage = () => {
  return (
    <main className="mx-auto flex max-w-5xl flex-col w-full">
      <div className="flex flex-col w-full  gap-x-16  gap-y-8 md:gap-y-16 md:pt-16 pb-8 md:pb-16   md:grid md:grid-cols-2">
        <HomepageSection
          cta={
            <HomepageButton
              link={{
                href: DOCS_URL,
                blankTarget: true,
              }}
              SuffixIcon={HiMiniArrowRight}
            >
              Get Started
            </HomepageButton>
          }
          headline={
            <>
              The Universal <br /> DeFi Computer
            </>
          }
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
          <p>
            Valence is a unified stack for building <br /> secure cross-chain
            DeFi applications.
          </p>
          <p>
            Simple, expressive developer <br /> experience. Write, test, and
            deploy <br />
            your first program in 15 minutes.
          </p>
        </HomepageSection>

        <div className="col-span-full h-[1px] border-b-[1.5px] border-valence-black "></div>
        <HomepageSection
          imgFirst
          cta={
            <HomepageButton
              link={{
                href: VAULTS_URL,
                blankTarget: true,
              }}
              SuffixIcon={HiMiniArrowRight}
            >
              Try x-vaults
            </HomepageButton>
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
          <p className="italic text-md">
            Onboard liquidity from any chain. <br /> Deploy liquidity to any
            ecosystem.
          </p>
          <p className="text-md">
            x-vaults are a programmable <br /> interoperability primitive for{" "}
            <br /> building secure cross-chain <br /> asset flows.
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
            <HomepageButton
              link={{
                href: DOCS_URL,
                blankTarget: true,
              }}
              SuffixIcon={HiMiniArrowRight}
            >
              Learn more
            </HomepageButton>
          }
        >
          <p>
            Valence provides a unified <br /> development environment for <br />{" "}
            writing cross-chain programs.
          </p>
          <p>
            Abstract over EVM, SVM, WASM, <br />
            Move and compile programs to <br /> sovereign ZK co-processors on{" "}
            <br /> any chain.
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
  headline: string | React.ReactNode;
  cta: React.ReactNode;
  Img: React.ReactNode;
  imgFirst?: boolean;
}) => {
  const ImageComponent = () => (
    <div className="hidden md:flex flex-col w-full items-center justify-center p-4 md:p-8 md:px-16  ">
      {Img}
    </div>
  );

  return (
    <>
      {imgFirst && <ImageComponent />}

      <div className="flex flex-col gap-4 md:gap-6 p-8 md:px-16 justify-center text-lg">
        <HomepageHeadline className="">{headline}</HomepageHeadline>
        {children}
        {/* mobile Image */}
        <div className=" flex md:hidden flex-col w-full items-center justify-center p-4 md:p-8 md:px-16  ">
          {Img}
        </div>
        <div className="self-end px-8 md:px-0 md:pt-4 ">{cta}</div>
      </div>
      {!imgFirst && <ImageComponent />}
    </>
  );
};

export default HomePage;
