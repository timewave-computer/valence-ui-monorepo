import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import {
  Post,
  PostFrontMatter,
  PostFrontMatterSchema,
  PostList,
} from "~/types/blog";
import { UTCDate } from "@date-fns/utc";
import { compareDesc } from "date-fns";
import { ErrorHandler } from "~/const/error";
import { h } from "hastscript";

import { visit } from "unist-util-visit";

function addClassToImageParagraph() {
  //@ts-ignore
  return (tree) => {
    visit(tree, "element", (node) => {
      if (
        node.tagName === "p" &&
        //@ts-ignore
        node.children.some((child) => child.tagName === "img")
      ) {
        node.properties = node.properties || {};
        node.properties.className = (node.properties.className || []).concat(
          "image-paragraph",
        );
      }
    });
  };
}

function wrapHeadingsInDiv() {
  //@ts-ignore
  return (tree) => {
    visit(tree, ["element"], (node, index, parent) => {
      if (node.tagName === "h1") {
        // Create a div element with a custom classname
        const wrapperDiv = h("div.h1-container", [node]);

        // Replace the original node with the wrapper div in the parent's children array
        if (parent && typeof index === "number") {
          parent.children.splice(index, 1, wrapperDiv);
        }
      } else if (node.tagName === "h2") {
        // Create a div element with a custom classname
        const wrapperDiv = h("div.h2-container", [node]);

        // Replace the original node with the wrapper div in the parent's children array
        if (parent && typeof index === "number") {
          parent.children.splice(index, 1, wrapperDiv);
        }
      }
    });
  };
}

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
      ErrorHandler.makeError("Error parsing post", e);
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
  const processedContent = await unified()
    .use(remarkParse) // Parse the markdown content
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to rehype (HTML AST), allowing raw HTML
    .use(rehypeRaw) // Parse the raw HTML inside the markdown
    .use(addClassToImageParagraph) // Custom plugin to add class to <p> containing <img>
    .use(wrapHeadingsInDiv) // Custom plugin to wrap <h1> and <h2> in a <div>
    .use(rehypeStringify) // Stringify the rehype tree back to HTML
    .process(content);

  return {
    slug,
    content: processedContent.toString(),
    frontMatter,
  };
};
