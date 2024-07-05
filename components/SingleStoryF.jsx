"use client";
import { useState } from "react";
import { splitTextIntoSentences } from "../utils/helper";

const SingleStoryF = ({ story }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  // Function to handle mouse over a sentence
  const handleMouseOver = (index) => {
    setHighlightedIndex(index);
  };

  // Function to handle mouse out from a sentence
  const handleMouseOut = () => {
    setHighlightedIndex(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-black">
        Story Detail Page
      </h1>
      <div className="flex space-x-6">
        {/* English Story */}
        <div className="flex-1 bg-white border rounded-lg shadow-md p-4 text-black">
          <h2 className="text-lg font-bold mb-2">English Story:</h2>
          {splitTextIntoSentences(story.english_story).map(
            (sentence, index) => (
              <p
                key={index}
                className={`mb-2 cursor-pointer ${
                  highlightedIndex === index ? "bg-yellow-200" : ""
                }`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={handleMouseOut}
              >
                {sentence}
              </p>
            )
          )}
        </div>

        {/* Finnish Story */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-md p-4 text-black">
          <h2 className="text-lg font-bold mb-2">Finnish Story:</h2>
          {splitTextIntoSentences(story.finnish_story).map(
            (sentence, index) => (
              <p
                key={index}
                className={`mb-2 cursor-pointer ${
                  highlightedIndex === index ? "bg-yellow-200" : ""
                }`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={handleMouseOut}
              >
                {sentence}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleStoryF;
