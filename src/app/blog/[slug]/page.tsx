import { ErrorHandler } from "@/const/error";
import { getPost } from "@/server/blog/get-posts";
import { Post } from "@/types/blog";
import { RouterButton } from "./RouterButton";
import { FaChevronLeft } from "react-icons/fa";
import { UTCDate } from "@date-fns/utc";
import "./article.css";
import Image from "next/image";

const BlogPost = async ({ params }: { params: { slug: string } }) => {
  let postData: Post | null = null;
  let error = null;

  try {
    postData = await getPost(params.slug);
  } catch (e) {
    ErrorHandler.makeError("Error loading blog post", e, { throw: false });
    error = true;
  }

  if (error || !postData)
    return (
      <div className="min-h-1/2 flex grow flex-col items-start gap-12 pb-24">
        <div className="flex flex-col items-start gap-4 text-left">
          <h2 className="font-mono text-2xl text-valence-black ">
            There was a problem loading this post.
          </h2>
          <RouterButton
            options={{ refresh: true }}
            className="pt-2 font-mono text-valence-blue hover:underline"
          >
            Try a refresh?
          </RouterButton>
          <RouterButton
            options={{ back: true }}
            className="pt-2 font-mono text-valence-black hover:underline"
          >
            Go back
          </RouterButton>
        </div>
      </div>
    );

  return (
    <div className="min-h-1/2 flex grow flex-col gap-4 pb-20">
      <RouterButton
        options={{ back: true }}
        className="flex items-center gap-2 self-start text-valence-gray hover:underline  "
      >
        <FaChevronLeft className="h-4 w-4 transition-all  " />

        <span className="text-sm font-medium tracking-tight "> Go Back</span>
      </RouterButton>
      <section className="pb-4">
        <span className="text-sm">
          {new UTCDate(postData.frontMatter.date).toLocaleDateString()}
        </span>

        <h1 className="py-2 font-serif text-4xl font-semibold">
          {postData.frontMatter.title}
        </h1>
        <span className="pt-1">By {postData.frontMatter.author}</span>
      </section>

      {<article dangerouslySetInnerHTML={{ __html: postData.content }} />}
    </div>
  );
};

export default BlogPost;
