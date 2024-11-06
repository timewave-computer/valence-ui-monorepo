import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { cn } from "~/utils";

export const BackButton = ({
  className,
  link,
}: {
  className?: string;
  link: {
    href: string;
    label: string;
  };
}) => {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex flex-row gap-2 w-fit items-center text-valence-gray ",
        className,
      )}
    >
      <button>
        <FaChevronLeft className="h-4 w-4 " />
      </button>

      <span className="text-valence-gray transition-all hover:underline text-sm underline-offset-2">
        {link.label}
      </span>
    </Link>
  );
};
