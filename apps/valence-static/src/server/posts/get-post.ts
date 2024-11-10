import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { Post } from "~/types/blog";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { postsDirectory, validatePost } from "~/server/posts";

/***
 * add classname to <p> tags containing <img> tags
 */
function labelImagePTags() {
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
          "image-paragraph",
        );
      }
    });
  };
}

/***
 * inserts div.h1 border for styline
 * MUST be called after wrapHeadingsInDiv
 */
function insertH1BorderDivs() {
  //@ts-ignore
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.properties?.className?.includes("h1-container")) {
        // Check if the previous sibling is already an h1-border div
        // avoids infinite loop
        if (
          parent &&
          typeof index === "number" &&
          parent.children[index - 1]?.properties?.className?.includes(
            "h1-border",
          )
        ) {
          return;
        }
        // Create a new div element to insert above the heading wrapper
        const aboveDiv = h("div.h1-border", []);

        // Replace the original node with the wrapper div in the parent's children array
        if (parent && typeof index === "number") {
          parent.children.splice(index, 0, aboveDiv);
        }
      }
    });
  };
}

/***
 * wraps h1 and h2 in style-able containers
 *
 * technnically not needed to have headers wrapped in a div anymore, but its here if needed
 */
function wrapHeadingsInDiv() {
  return (tree) => {
    visit(tree, ["element"], (node, index, parent) => {
      if (node.tagName === "h1" || node.tagName === "h2") {
        const selector =
          node.tagName === "h1" ? "div.h1-container" : "div.h2-container";
        const wrapperDiv = h(selector, [node]); // wrap node in div with className  = h1-container or h2-container
        // Replace the original node with the wrapper div in the parent's children array
        if (parent && typeof index === "number") {
          parent.children.splice(index, 1, wrapperDiv);
        }
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
    .use(labelImagePTags) // Custom plugin to add class to <p> containing <img>
    .use(wrapHeadingsInDiv) // Custom plugin to wrap <h1> and <h2> in a <div>

    .use(insertH1BorderDivs) // MUST run after wrapHeadingsInDiv
    .use(rehypeStringify) // Stringify the rehype tree back to HTML
    .process(content);

  return {
    slug,
    content: processedContent.toString(),
    frontMatter,
  };
};
