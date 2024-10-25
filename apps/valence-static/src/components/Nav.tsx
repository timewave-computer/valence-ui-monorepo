"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { Button, cn } from "@valence-ui/components";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";

const shouldHightlightItem = (href: string, path: string) => {
  if (href === "/")
    return path === "/"; // special case for home
  else return path.startsWith(href);
};

const NavLink = ({
  href,
  label,
  path,
}: {
  href: string;
  label: string;
  path: string;
}) => {
  return (
    <a
      key={`nav-${href}`}
      className={cn(
        "relative top-[1px] flex flex-row items-center",
        shouldHightlightItem(href, path) && "font-bold",
        "transition-all focus:font-bold", // mobile,
        "md:focus:font-normal",
      )}
      href={href}
    >
      {label}
    </a>
  );
};

export const Nav = () => {
  const path = usePathname();
  const links = (
    <>
      <NavLink href="/blog" label="Blog" path={path} />
    </>
  );

  return (
    <nav
      className={cn(
        "flex min-h-[3.25rem] flex-row items-center justify-between border-b border-valence-black bg-valence-white px-4 text-valence-black",
        path === "/" && "flex md:hidden",
      )}
    >
      <div className="flex items-center gap-2 md:gap-8">
        <a className="" href="/">
          <Image
            src="/img/valence_horizontal.svg"
            alt="Logo"
            width={110}
            height={38}
          />
        </a>
        <div className="hidden flex-row gap-8 md:flex">{links}</div>
      </div>

      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild className="outline-none">
            <Button
              variant="secondary"
              className=" min-w-0 transform border-none  transition-transform active:scale-90
               "
            >
              <IoMdMenu className="h-6 w-6  " />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <div className=" flex flex-col gap-8 p-4 text-xl">
              {/* special case for mobile */}
              <NavLink href="/" label="Home" path={path} />
              {links}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
