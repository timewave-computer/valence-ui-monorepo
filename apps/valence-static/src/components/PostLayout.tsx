import { UTCDate } from "@date-fns/utc";
import Link from "next/link";
import Image from "next/image";
import { cn, Heading } from "@valence-ui/ui-components";

export const PostLayout = ({
  title,
  children,
  slug,
  imageUrl,
  date,
  isLink,
}: {
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
  isLink?: boolean;
  children: React.ReactNode;
}) => {
  const PostBody = (
    <div
      {...(isLink ? { href: `/blog/${slug}` } : {})}
      className={cn(
        "flex flex-col  items-start   ", // mobile
        "md:grid md:grid-cols-3 md:gap-y-4  md:py-8 md:pb-10 md:gap-x-16", // desktop
      )}
    >
      <DateAndImage
        date={date}
        imageUrl={imageUrl}
        className="hidden md:flex col-span-1 pt-1"
      />{" "}
      {/* desktop */}
      <div className="flex flex-col gap-2 md:gap-4  col-span-2  ">
        <Heading level="h1">{title}</Heading>
        {/* mobile */}
        <DateAndImage
          date={date}
          imageUrl={imageUrl}
          className="  md:hidden items-start"
        />{" "}
        <div className="text-h3 leading-8 ">{children}</div>
      </div>
    </div>
  );

  if (isLink) {
    return <Link href={`/blog/${slug}`}>{PostBody}</Link>;
  } else return PostBody;
};
const DateAndImage = ({
  date,
  imageUrl,
  className,
}: {
  imageUrl: string;
  date: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-2 items-center", className)}>
      <span className="  font-mono text-xs">
        {new UTCDate(date)
          .toLocaleDateString("en-GB", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, ".")}
      </span>

      <Image
        priority={true}
        className="w-full self-center "
        src={imageUrl}
        alt="Post Image"
        width={300}
        height={200}
      />
    </div>
  );
};
