// pages/dialogs/[id].js
import { getStoryById } from "../../../_lib/data-service";
import SingleStoryF from "../../../../components/SingleStoryF";

const StoryDetailPage = async ({ params }) => {
  const storyId = params.id;

  const story = await getStoryById(storyId);

  return <SingleStoryF story={story} />;
};

export default StoryDetailPage;
