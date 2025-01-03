import fs from "fs";
import path from "path";

const storiesDirectory = path.join(process.cwd(), "src/app/stories");

export function getStories() {
  const fileNames = fs.readdirSync(storiesDirectory);
  return fileNames.map((fileName) => {
    const id = fileName.replace(/\.tsx$/, "");
    return {
      id,
      filePath: path.join(storiesDirectory, fileName),
    };
  });
}

export type GetStories = ReturnType<typeof getStories>;
