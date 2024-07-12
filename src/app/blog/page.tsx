import { ErrorHandler } from "@/const/error";
import { getSortedPosts } from "@/server/blog/get-posts";
import { PostList } from "@/types/blog";
import { UTCDate } from "@date-fns/utc";
import Link from "next/link";
import { RouterButton } from "@/components";
import { Metadata } from "next";
import { ABSOLUTE_URL, VALENCE_DESCRIPTION, X_HANDLE } from "@/const/socials";

const trimContent = (content: string) => {
  if (content.length > 200) {
    return content.slice(0, 200) + "...";
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
  let error = null;

  try {
    posts = getSortedPosts();
  } catch (e) {
    ErrorHandler.makeError("Error loading blog posts", e, { throw: false });
    error = true;
  }
  if (error)
    return (
      <div className="min-h-1/2 flex grow flex-col items-start gap-12 pb-20">
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
    <div className="min-h-1/2 flex grow flex-col items-start gap-12 pb-24 pt-7">
      {posts.map((post) => (
        <Link key={`blog-post-${post.slug}`} href={`/blog/${post.slug}`}>
          <section className="">
            <span className="text-sm">
              {new UTCDate(post.date).toLocaleDateString()}
            </span>

            <h1 className="py-2 font-serif text-4xl font-medium hover:underline">
              {post.title}
            </h1>
            <p className="text-lg">{trimContent(post.preview)}</p>
          </section>
        </Link>
      ))}
    </div>
  );
};

export default BlogHome;
