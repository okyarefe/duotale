// pages/dialogs/[id].js
import { getStoryById } from "../../../_lib/data-service";

import SingleStoryF from "../../../../components/SingleStoryF";

const StoryDetailPage = async ({ params }) => {
  const storyId = params.id;

  const story = await getStoryById(storyId);

  return (
    <>
      <h1 className="text-3xl text-black">Story Details</h1>
      <SingleStoryF story={story} />
    </>
  );
};

export default StoryDetailPage;
