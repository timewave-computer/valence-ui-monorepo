"use client";
import { cn } from "@valence-ui/ui-components";
import Image from "next/image";
import Link from "next/link";
import { X_URL, GITHUB_URL, DOCS_URL } from "@valence-ui/socials";
import { VALENCE_DESCRIPTION } from "~/const";

export const Footer = (
  { className }: { className?: string } = { className: "" },
) => {
  return (
    <footer
      className={cn(
        "mx-auto border-t w-full border-valence-black max-w-5xl px-4 py-8  flex flex-col gap-x-14 gap-y-6 text-sm md:grid md:grid-cols-2 ",
        className,
      )}
    >
      <Link href={"/"}>
        <Image
          className="col-span-1   flex-col justify-between"
          src="/img/valence_horizontal.svg"
          alt="Valence illustration"
          width={110}
          height={38}
        />
      </Link>

      <div className="col-span-1 col-start-2 flex flex-col gap-2 ">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Github
        </a>
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Documentation
        </a>
        <Link className="hover:underline" href="/blog">
          Blog
        </Link>
        <a
          href={X_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          X
        </a>
      </div>

      <div className="col-span-1 row-start-2 flex flex-col gap-4">
        <p>{VALENCE_DESCRIPTION}</p>
      </div>

      <div className=" col-span-1 col-start-2 row-start-2 self-start  md:self-end">
        <p>© 2025 Timewave </p>
      </div>
    </footer>
  );
};
