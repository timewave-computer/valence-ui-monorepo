import { UTCDate } from "@date-fns/utc";
import Link from "next/link";
import Image from "next/image";
import { PostHeading } from "~/app/blog/ui-components";
import { cn } from "@valence-ui/ui-components";

export const PostLayout = ({
  title,
  children,
  slug,
  imageUrl,
  date,
}: {
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col  items-start  ", // mobile
        "md:grid md:grid-cols-3 md:gap-y-4    md:py-8 md:pb-10 md:gap-x-16", // desktop
      )}
    >
      <PostAndImage
        slug={slug}
        date={date}
        imageUrl={imageUrl}
        className="hidden md:flex col-span-1"
      />{" "}
      {/* desktop */}
      <div className="flex flex-col gap-4  col-span-2  ">
        <PostHeading slug={slug}>{title}</PostHeading>
        {/* mobile */}
        <PostAndImage
          slug={slug}
          date={date}
          imageUrl={imageUrl}
          className="  md:hidden items-start"
        />{" "}
        <div className="text-h3 leading-8 ">{children}</div>
      </div>
    </div>
  );
};
const PostAndImage = ({
  slug,
  date,
  imageUrl,
  className,
}: {
  imageUrl: string;
  date: string;
  slug: string;
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
      <Link className="flex flex-col gap-2    " href={`/blog/${slug}`}>
        <Image
          className="w-full self-center "
          src={imageUrl}
          alt="Post Image"
          width={300}
          height={200}
        />
      </Link>
    </div>
  );
};
