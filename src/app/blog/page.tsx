import { ErrorHandler } from "@/const/error";
import { getSortedPosts } from "@/server/blog/get-posts";
import { PostList } from "@/types/blog";
import { UTCDate } from "@date-fns/utc";
import Link from "next/link";
import { RouterButton } from "./[slug]/RouterButton";
import BlogPost from "./[slug]/page";

const trimContent = (content: string) => {
  if (content.length > 200) {
    return content.slice(0, 200) + "...";
  } else return content;
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
    <div className="min-h-1/2 flex grow flex-col items-start gap-12 pb-24">
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
