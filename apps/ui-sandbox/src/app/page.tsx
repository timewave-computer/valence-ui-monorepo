import Link from "next/link";
import { getStories, GetStories } from "~/lib";

export default function Home() {
  const stories = getStories();
  console.log("stories", stories);
  return (
    <div>
      <h1 className="font-mono font-bold">All</h1>
      {stories.map((story: GetStories[number]) => {
        const StoryComponent = require(`./stories/${story.id}`).default;
        return <StoryComponent key={story.id} />;
      })}
    </div>
  );
}
