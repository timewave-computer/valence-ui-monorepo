import Link from "next/link";

export const PostHeading: React.FC<{
  children: React.ReactNode;
  slug?: string;
}> = ({ children, slug }) => {
  const heading = (
    <h1 className="text-balance text-h1 font-medium font-mono ">{children}</h1>
  );

  if (!slug) {
    return heading;
  }

  return (
    <Link className=" flex w-full flex-col  " href={`/blog/${slug}`}>
      {heading}
    </Link>
  );
};
