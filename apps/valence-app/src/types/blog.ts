import { z } from "zod";

export const PostFrontMatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
  heroImagePath: z.string(),
});

export type PostFrontMatter = z.infer<typeof PostFrontMatterSchema>;

export type PostList = Array<
  PostFrontMatter & {
    slug: string;
    preview: string;
  }
>;

export type Post = {
  slug: string;
  content: string;
  frontMatter: PostFrontMatter;
};
