import { Heading } from "@valence-ui/ui-components";
import Link from "next/link";

export const PostHeading: React.FC<{
  children: React.ReactNode;
  slug?: string;
}> = ({ children, slug }) => {
  const heading = (
    <Heading level="h1" className="text-balance">
      {children}
    </Heading>
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
