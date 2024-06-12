import { ErrorHandler } from "@/const/error";
import { getSortedPosts } from "@/server/blog/get-posts";
import { PostList } from "@/types/blog";
import { UTCDate } from "@date-fns/utc";
import Link from "next/link";
import Image from "next/image";
import { RouterButton } from "./[slug]/RouterButton";

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
      <main className="flex grow flex-col items-center bg-white px-4 py-8">
        <div className="flex-1 "></div>{" "}
        {/* This div will take up 1/4 of the space */}
        <div className="flex flex-[3] flex-col items-center p-6 text-center">
          {" "}
          {/* This div will take up 3/4 of the space */}
          <Image
            src="/img/hero.svg"
            alt="Valence illustration"
            width={140}
            height={140}
            className="mb-10 self-center"
          />
          <h2 className="font-mono text-2xl text-valence-black ">
            Sorry, there was a problem loading the blog.
          </h2>
          <RouterButton
            options={{ refresh: true }}
            className="pt-2 font-mono text-valence-blue hover:underline"
          >
            Try a refresh?
          </RouterButton>
        </div>
      </main>
    );

  return (
    <main className="flex grow flex-col items-center bg-white px-4 py-8">
      <div className="flex max-w-[660px] grow flex-col gap-4">
        {posts.map((post) => (
          <Link key={`blog-post-${post.slug}`} href={`/blog/${post.slug}`}>
            <section className="">
              <span className="text-sm">
                {new UTCDate(post.date).toLocaleDateString()}
              </span>

              <h1 className="py-2 font-serif text-4xl font-semibold hover:underline">
                {post.title}
              </h1>

              <span className="pt-1">By {post.author}</span>

              <p className="pt-4 text-lg">{trimContent(post.preview)}</p>
            </section>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default BlogHome;
