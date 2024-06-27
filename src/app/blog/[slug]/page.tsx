import { ErrorHandler } from "@/const/error";
import { getPost } from "@/server/blog/get-posts";
import { Post } from "@/types/blog";
import { RouterButton } from "./RouterButton";
import { FaChevronLeft } from "react-icons/fa";
import { UTCDate } from "@date-fns/utc";
import "./article.css";
import { ABSOLUTE_URL, X_HANDLE } from "@/const/socials";
import { Metadata, ResolvingMetadata } from "next";

type BlogPostProps = {
  params: {
    slug: string;
  };
};
export async function generateMetadata(
  { params: { slug } }: BlogPostProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const frontmatter = (await getPost(slug)).frontMatter;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      siteName: frontmatter.title,
      description: frontmatter.description,
      url: `${ABSOLUTE_URL}/blog/${slug}`,
      images: ["/img/opengraph/valence-horizontal-og.png"],
    },
    twitter: {
      creator: X_HANDLE,
      card: "summary",
      images: ["/img/opengraph/valence-vertical-og.png"],
      description: frontmatter.description,
    },
  };
}

const BlogPost = async ({ params }: BlogPostProps) => {
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
    <div className="min-h-1/2 flex grow flex-col gap-2 pb-20">
      <RouterButton
        options={{ back: true }}
        className="flex items-center gap-2 self-start text-valence-gray hover:underline  "
      >
        <FaChevronLeft className="h-4 w-4 transition-all  " />

        <span className="text-sm font-medium tracking-tight "> Go Back</span>
      </RouterButton>
      <section>
        <span className="text-sm">
          {new UTCDate(postData.frontMatter.date).toLocaleDateString()}
        </span>

        <h1 className="py-2 font-serif text-4xl font-medium">
          {postData.frontMatter.title}
        </h1>
      </section>

      <article dangerouslySetInnerHTML={{ __html: postData.content }} />
    </div>
  );
};

export default BlogPost;
