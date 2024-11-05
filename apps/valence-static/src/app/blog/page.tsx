import { ErrorHandler } from "~/const/error";
import { getSortedPosts } from "~/server/blog/get-posts";
import { PostList } from "~/types/blog";
import { UTCDate } from "@date-fns/utc";
import Link from "next/link";
import { RouterButton } from "~/components";
import { Metadata } from "next";
import { ABSOLUTE_URL, VALENCE_DESCRIPTION, X_HANDLE } from "~/const/socials";
import Image from "next/image";
import { BackButton, PostHeading } from "~/app/blog/ui-components";
import { Fragment } from "react";

const previewLength = 260;
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
          <h2 className="pt-4 font-mono text-2xl text-valence-black ">
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

  return (
    // top padding is to avoid shifting layout for back button in desktop
    <div className="min-h-1/2 flex flex-col items-start">
      {posts.map((post) => (
        <Fragment key={`blog-post-${post.slug}`}>
          <PostHeading slug={post.slug}>{post.title}</PostHeading>

          <Link
            className="flex grid-cols-5 flex-col gap-2 gap-x-8 pb-8 pt-2 md:grid md:gap-0 md:pb-16  "
            href={`/blog/${post.slug}`}
          >
            <span className="col-span-1 col-start-1 row-start-1 md:pb-2">
              {new UTCDate(post.date).toLocaleDateString()}
            </span>
            <Image
              className="col-span-2 row-start-2 hidden w-full self-center md:flex md:self-start"
              src={post.heroImagePath}
              alt="Post Image"
              width={400}
              height={300}
            />
            <p className="col-span-4  col-start-3  row-start-2 text-pretty text-lg ">
              {trimContent(post.preview)}
            </p>
          </Link>
        </Fragment>
      ))}
    </div>
  );
};

export default BlogHome;
