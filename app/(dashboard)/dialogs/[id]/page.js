// pages/dialogs/[id].js
import { getStoryById } from "../../../_lib/data-service";
import SingleStoryF from "../../../../components/SingleStoryF";

const StoryDetailPage = async ({ params }) => {
  const storyId = params.id;

  const story = await getStoryById(storyId);

  return (
    <SingleStoryF story={story} />
    // <div>
    //   <h1>Story Detail Page</h1>

    //   <h2>English Story:</h2>
    //   <p>{story.english_story}</p>
    //   <h2>Finnish Story:</h2>
    //   <p>{story.finnish_story}</p>
    // </div>
  );
};

export default StoryDetailPage;
