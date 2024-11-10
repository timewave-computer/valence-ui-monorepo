import path from "path";
import matter from "gray-matter";
import { PostFrontMatterSchema } from "~/types/blog";

export const POSTS_PATH = "blog-posts/published";
export const postsDirectory = path.join(process.cwd(), POSTS_PATH);
export const validatePost = (fileContents: string) => {
  const { data, content } = matter(fileContents);
  const frontMatter = PostFrontMatterSchema.parse(data);
  return { frontMatter, content };
};
