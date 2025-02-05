import { ErrorHandler } from "~/const/error";
import { getSortedPosts } from "~/server/posts";
import { PostList } from "~/types/blog";

import { PostLayout, RouterButton } from "~/components";
import { Metadata } from "next";
import { X_HANDLE } from "@valence-ui/socials";
import { VALENCE_DESCRIPTION, ABSOLUTE_URL } from "~/const";
import { Fragment } from "react";

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

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post, i) => (
        <Fragment key={`blog-post-${post.slug}`}>
          <PostLayout
            isLink={true}
            title={post.title}
            date={post.date}
            slug={post.slug}
            imageUrl={post.heroImagePath}
          >
            <p> {trimContent(post.preview)}</p>
          </PostLayout>
          {i !== posts.length - 1 && (
            <div className="col-span-2 border-dotted border-t-[2px] border-valence-black w-full" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default BlogHome;
