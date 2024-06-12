import fs from "fs";
import matter, { GrayMatterFile } from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import {
  Post,
  PostFrontMatter,
  PostFrontMatterSchema,
  PostList,
} from "@/types/blog";
import { UTCDate } from "@date-fns/utc";
import { compareDesc } from "date-fns";
import { ErrorHandler } from "@/const/error";

const POSTS_PATH = "blog-posts/published";
const postsDirectory = path.join(process.cwd(), POSTS_PATH);

const validatePost = (fileContents: string) => {
  const { data, content } = matter(fileContents);
  const frontMatter = PostFrontMatterSchema.parse(data);
  return { frontMatter, content };
};

export const getSortedPosts = (): PostList => {
  const postsDirectory = path.join(process.cwd(), POSTS_PATH);
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts: PostList = [];
  fileNames.forEach((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const slug = fileName.replace(/\.md$/, "");
    const fileContents = fs.readFileSync(fullPath, "utf8");
    let frontMatter: PostFrontMatter;
    try {
      ({ frontMatter } = validatePost(fileContents));

      allPosts.push({
        slug,
        preview: frontMatter.description,
        ...frontMatter,
      });
    } catch (e) {
      ErrorHandler.makeError("Error parsing post", e, { throw: false });
    }
  });
  return allPosts.sort((a, b) => {
    return compareDesc(new UTCDate(a.date), new UTCDate(b.date));
  });
};

export const getPost = async (slug: string): Promise<Post> => {
  const postPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(postPath, "utf8");
  const { frontMatter, content } = validatePost(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    content: processedContent.toString(),
    frontMatter,
  };
};
