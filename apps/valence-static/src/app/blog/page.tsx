import { ErrorHandler } from "~/const/error";
import { getSortedPosts } from "~/server/posts";
import { PostList } from "~/types/blog";
import { UTCDate } from "@date-fns/utc";
import Link from "next/link";
import { RouterButton } from "~/components";
import { Metadata } from "next";
import { X_HANDLE } from "@valence-ui/socials";
import { VALENCE_DESCRIPTION, ABSOLUTE_URL } from "~/const";
import Image from "next/image";
import { PostHeading } from "~/app/blog/ui-components";
import { Fragment } from "react";
import { cn } from "@valence-ui/ui-components";

const previewLength = 360;
const trimContent = (content: string) => {
  if (content.length > previewLength) {
    return content.slice(0, previewLength) + "...";
  } else return content;
};

export const metadata: Metadata = {
  title: "Valence Blog",
  description: VALENCE_DESCRIPTION,
  openGraph: {
    siteName: "Valence Blog",
    description: VALENCE_DESCRIPTION,
    url: `${ABSOLUTE_URL}/blog`,
    images: ["/img/opengraph/valence-horizontal-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/valence-vertical-og.png"],
    description: VALENCE_DESCRIPTION,
  },
};

const BlogHome = async () => {
  let posts: PostList = [];
  let error: boolean | null = null;

  try {
    posts = getSortedPosts();
  } catch (e) {
    ErrorHandler.makeError("Error loading blog posts", e);
    error = true;
  }
  if (error)
    return (
      <div className="min-h-1/2 flex grow flex-col items-start gap-12 pb-8">
        <div className="flex flex-col items-start gap-4 text-left">
          <h2 className="pt-4 font-mono text-h1 text-valence-black ">
            There was a problem loading the blog.
          </h2>
          <RouterButton
            options={{ refresh: true }}
            className="pt-2 font-mono text-valence-blue hover:underline"
          >
            Try a refresh?
          </RouterButton>
        </div>
      </div>
    );

  const PostAndImage = ({
    post,
    className,
  }: {
    post: PostList[0];
    className?: string;
  }) => {
    return (
      <div className={cn("flex flex-col gap-2 items-center", className)}>
        <span className="  font-mono text-base">
          {new UTCDate(post.date)
            .toLocaleDateString("en-GB", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, ".")}
        </span>
        <Link
          className="flex flex-col gap-2    md:pb-16  "
          href={`/blog/${post.slug}`}
        >
          <Image
            className="  w-full self-center "
            src={post.heroImagePath}
            alt="Post Image"
            width={400}
            height={300}
          />
        </Link>
      </div>
    );
  };

  return (
    // top padding is to avoid shifting layout for back button in desktop
    <div className="flex flex-col md:grid grid-cols-2  items-start  gap-y-4 md:pt-4 md:gap-x-16 ">
      {posts.map((post, i) => (
        <Fragment key={`blog-post-${post.slug}`}>
          <PostAndImage post={post} className="hidden md:flex" />{" "}
          {/* desktop */}
          <div className="flex flex-col gap-4  ">
            <PostHeading slug={post.slug}>{post.title}</PostHeading>
            <PostAndImage
              post={post}
              className="  md:hidden items-start"
            />{" "}
            {/* mobile */}
            <p className="  text-pretty text-h3 leading-8 ">
              {trimContent(post.preview)}
            </p>
          </div>
          {i !== posts.length - 1 && (
            <div className="col-span-2 border-dotted border-t-[2px] border-valence-black py-4 mt-4 md:pt-0 md:py-8 w-full" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default BlogHome;
