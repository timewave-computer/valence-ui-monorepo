import { ErrorHandler } from "~/const/error";
import { Post } from "~/types/blog";
import { RouterButton } from "~/components";
import { UTCDate } from "@date-fns/utc";
import { ABSOLUTE_URL } from "~/const";
import { X_HANDLE } from "@valence-ui/socials";
import { Metadata } from "next";
import Image from "next/image";
import { PostHeading, BackButton } from "~/app/blog/ui-components";
import "./article.css";
import path from "path";
import fs from "fs";
import { getPost, POSTS_PATH } from "~/server/posts";

// statically render routes so blog posts not rendered dynamically
export async function generateStaticParams() {
  const blogPostsDirectory = path.join(process.cwd(), POSTS_PATH);
  const filenames = fs.readdirSync(blogPostsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ""), // remove .md from url
  }));
}

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

const BlogPost: React.FC<BlogPostProps> = async ({ params }) => {
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
    <div className="min-h-1/2 flex grow flex-col pt-4 md:gap-2  ">
      <div className="">
        <BackButton
          link={{
            href: "/blog",
            label: "Back to Blog",
          }}
        />
        <div className=" py-2   ">
          <PostHeading> {postData.frontMatter.title}</PostHeading>
          <span className="col-span-1 col-start-1">
            {new UTCDate(postData.frontMatter.date).toLocaleDateString()}
          </span>
        </div>
        <div className=" grid-cols-5 gap-x-8 md:grid">
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
      <BackButton
        className="pt-4"
        link={{
          href: "/blog",
          label: "Back to Blog",
        }}
      />
    </div>
  );
};

export default BlogPost;
