import fs from "fs";
import path from "path";

import { PostFrontMatter, PostList } from "~/types/blog";
import { UTCDate } from "@date-fns/utc";
import { compareDesc } from "date-fns";

import { POSTS_PATH, validatePost } from "~/server/posts";
import { ErrorHandler } from "~/const";

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
      ErrorHandler.makeError("Error parsing post", e);
    }
  });
  return allPosts.sort((a, b) => {
    return compareDesc(new UTCDate(a.date), new UTCDate(b.date));
  });
};
