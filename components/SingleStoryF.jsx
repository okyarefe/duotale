"use client";
import { splitTextIntoSentences } from "../utils/helper";
import "react-toastify/dist/ReactToastify.css"; //
import { ToastContainer } from "react-toastify";
import StoryDisplay from "./StoryDisplay";
import StoryPlayer from "./StoryPlayer";

const SingleStoryF = ({ story }) => {
  console.log("Story ? ", story);
  return (
    <div className="p-4 md:p-6 flex flex-col">
      <div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="colored"
        />
        <StoryDisplay
          isLoading={false}
          englishSentences={splitTextIntoSentences(story.english_story)}
          finnishSentences={splitTextIntoSentences(
            story.translated_story || story.finnish_story
          )}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between">
        <StoryPlayer storyToAudio={story.english_story}></StoryPlayer>
        <StoryPlayer storyToAudio={story.translated_story}></StoryPlayer>
      </div>
    </div>
  );
};

export default SingleStoryF;
