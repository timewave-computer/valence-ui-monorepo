import { StoryLabel } from "~/components";
import React from "react";
import { getStories, GetStories } from "~/lib";
import dynamic from "next/dynamic";
import { SandboxConfig } from "~/config";

export default async function StoryPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const stories: GetStories = getStories();
  const { id } = await params;
  const story = stories.find(
    (story: GetStories[number]) => story.prettyName === id
  );

  if (!story) {
    return <div>Story not found</div>;
  }

  const StoryComponent = dynamic(() => import(`~/stories/${story.fileName}`), {
    loading: () => <p>Loading...</p>,
  });
  return (
    <div className="p-4 flex flex-col gap-2">
      <StoryLabel>{story.prettyName}</StoryLabel>

      <StoryComponent />
    </div>
  );
}
