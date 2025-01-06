import fs from "fs";
import path from "path";
import { SandboxConfig } from "~/config";

const storyDirectory = path.join(process.cwd(), "src/stories");

export function getStories() {
  const regex = SandboxConfig.storyFileRegex;

  const fileNames = fs.readdirSync(storyDirectory);
  return fileNames
    .filter((fileName) => regex.test(fileName))
    .map((fileName) => {
      return {
        fileName: fileName,
        filePath: path.join(storyDirectory, fileName),
        prettyName: fileName.replace(regex, ""),
      };
    });
}

export type GetStories = ReturnType<typeof getStories>;
