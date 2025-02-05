import { ErrorHandler } from "~/const/error";
import { Post } from "~/types/blog";
import { PostLayout, RouterButton } from "~/components";
import { ABSOLUTE_URL } from "~/const";
import { X_HANDLE } from "@valence-ui/socials";
import { Metadata } from "next";
import path from "path";
import fs from "fs";
import { getPost, POSTS_PATH } from "~/server/posts";
import Link from "next/link";
import { MdOutlineSubdirectoryArrowLeft } from "react-icons/md";
import { Button, cn } from "@valence-ui/ui-components";
import "./article.css";

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

const BackButton = ({ className }: { className?: string }) => (
  <Button
    variant="ghost"
    link={{
      href: "/blog",
      LinkComponent: Link,
      blankTarget: false,
    }}
    PrefixIcon={MdOutlineSubdirectoryArrowLeft}
    className={cn("px-0 min-w-0", className)}
  />
);

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
          <h2 className="font-mono text-h1 text-valence-black ">
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
    <div className="min-h-1/2 relative  ">
      <BackButton className="md:absolute md:top-7" />

      <PostLayout
        isLink={false}
        title={postData.frontMatter.title}
        date={postData.frontMatter.date}
        slug={postData.slug}
        imageUrl={postData.frontMatter.heroImagePath}
      >
        <article dangerouslySetInnerHTML={{ __html: postData.content }} />
      </PostLayout>
      <BackButton />
    </div>
  );
};

export default BlogPost;
