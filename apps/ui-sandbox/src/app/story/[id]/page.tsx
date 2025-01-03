import { StoryLabel } from "~/components";
import React from "react";
import { getStories, GetStories } from "~/lib";

export const StoryPage = ({
  params: { id },
}: {
  params: {
    id: string;
  };
}) => {
  const stories: GetStories = getStories();
  const story = stories.find((story: GetStories[number]) => story.id === id);

  if (!story) {
    return <div>Story not found</div>;
  }

  const StoryComponent = require(`../../../app/stories/${story.id}`).default;

  return (
    <div className="p-4 flex flex-col gap-2 w-fit">
      <StoryLabel>{story.id}</StoryLabel>

      <StoryComponent />
    </div>
  );
};

export default StoryPage;
