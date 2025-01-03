import fs from "fs";
import path from "path";

const storiesDirectory = path.join(process.cwd(), "src/app/stories");

export function getStories() {
  const fileNames = fs.readdirSync(storiesDirectory);
  return fileNames
    .filter((fileName) => fileName.includes(".stories"))
    .map((fileName) => {
      const id = fileName.replace(/\.tsx$/, "");
      return {
        id,
        fileName: fileName,
        filePath: path.join(storiesDirectory, fileName),
        prettyName: fileName.replaceAll(".stories.tsx", ""),
      };
    });
}

export type GetStories = ReturnType<typeof getStories>;
