import { StoryLabel } from "~/components";
import { getStories, GetStories } from "~/lib";

export default function Home() {
  const stories = getStories();
  return (
    <div className="flex flex-col gap-1">
      <StoryLabel className="text-h5">All</StoryLabel>

      {stories.map((story: GetStories[number]) => {
        const StoryComponent = require(`./stories/${story.id}`).default;
        return (
          <div className="p-4 flex flex-col gap-2" key={`story-${story.id}`}>
            <StoryLabel>{story.id}</StoryLabel>

            <StoryComponent key={story.id} />
          </div>
        );
      })}
    </div>
  );
}
