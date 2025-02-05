import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { Post } from "~/types/blog";
import { visit } from "unist-util-visit";
import { postsDirectory, validatePost } from "~/server/posts";

/***
 * replace <p> tags containing images with <div> tags
 */
function wrapImagesInDiv() {
  // @ts-ignore
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "p" &&
        //@ts-ignore
        node.children.some((child) => child.tagName === "img")
      ) {
        node.properties = node.properties || {};
        node.properties.className = (node.properties.className || []).concat(
          "image-container",
        );
        node.tagName = "div";
      }
    });
  };
}
/***
 * generates post from slug
 * functions are declarative and not performant because this runs during build time
 */
export const getPost = async (slug: string): Promise<Post> => {
  const postPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(postPath, "utf8");
  const { frontMatter, content } = validatePost(fileContents);
  const processedContent = await unified()
    .use(remarkParse) // Parse the markdown content
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to rehype (HTML AST), allowing raw HTML
    .use(rehypeRaw) // Parse the raw HTML inside the markdown
    .use(wrapImagesInDiv) // Custom plugin to add class to <p> containing <img>
    .use(rehypeStringify) // Stringify the rehype tree back to HTML
    .process(content);

  return {
    slug,
    content: processedContent.toString(),
    frontMatter,
  };
};
