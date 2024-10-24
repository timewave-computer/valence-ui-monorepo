import Link from "next/link";

export const PostHeading: React.FC<{
  children: React.ReactNode;
  slug?: string;
}> = ({ children, slug }) => {
  const heading = (
    <h1 className="text-balance py-2 font-serif   text-3xl font-medium ">
      {children}
    </h1>
  );

  if (!slug) {
    return heading;
  }

  return (
    <Link
      className=" flex w-full flex-col  border-b-[1px] border-valence-black "
      href={`/blog/${slug}`}
    >
      {heading}
    </Link>
  );
};
