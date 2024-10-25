import { ErrorHandler } from "~/const/error";
import { getPost } from "~/server/blog/get-posts";
import { Post } from "~/types/blog";
import { RouterButton } from "~/components";
import { FaChevronLeft } from "react-icons/fa";
import { UTCDate } from "@date-fns/utc";
import { ABSOLUTE_URL, X_HANDLE } from "~/const/socials";
import { Metadata } from "next";
import Image from "next/image";
import { cn } from "~/utils";
import { PostHeading } from "~/app/blog/common";
import "./article.css";

const BackButton = ({ className }: { className?: string }) => {
  return (
    <RouterButton
      options={{ href: "/blog" }}
      className={cn(
        "flex items-center gap-2 self-start text-valence-gray hover:underline",
        className,
      )}
    >
      <FaChevronLeft className="h-4 w-4 transition-all  " />

      <span className="py-1 text-sm font-medium tracking-tight ">
        Back to blog
      </span>
    </RouterButton>
  );
};
type BlogPostProps = {
  params: {
    slug: string;
  };
};
export async function generateMetadata({
  params: { slug },
}: BlogPostProps): Promise<Metadata> {
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
  let error: boolean | null = null;

  try {
    postData = await getPost(params.slug);
  } catch (e) {
    ErrorHandler.makeError("Error loading blog post", e);
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
    <div className="min-h-1/2 flex grow flex-col pb-8 md:gap-2">
      <div>
        <BackButton />
        <div className=" w-full  border-b-[1px] border-valence-black ">
          <PostHeading> {postData.frontMatter.title}</PostHeading>
        </div>
        <div className=" grid-cols-5 gap-x-8 pt-2 md:grid">
          <span className="col-span-1 col-start-1">
            {new UTCDate(postData.frontMatter.date).toLocaleDateString()}
          </span>
          <Image
            className="col-span-3 col-start-3 row-start-2 w-full"
            src={postData.frontMatter.heroImagePath}
            alt="Post Image"
            height={200}
            width={400}
          />
        </div>
      </div>

      <article dangerouslySetInnerHTML={{ __html: postData.content }} />
      <BackButton className="pt-8" />
    </div>
  );
};

export default BlogPost;
