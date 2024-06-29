"use client";

import { useState } from "react";
import { generateChatResponse } from "../utils/actions";

const Chat = () => {
  const [text, setText] = useState("");
  const [englishMessage, setEnglishMessage] = useState("");
  const [finnishMessage, setFinnishMessage] = useState("");
  const maxCharacters = 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { englishStory, finnishStory } = await generateChatResponse(text);
      setEnglishMessage(englishStory);
      setFinnishMessage(finnishStory);
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Prompt Div */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <textarea
            maxLength={maxCharacters}
            value={text}
            required={true}
            onChange={(e) => setText(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Enter your prompt here..."
          />
          <div className="text-right text-sm text-gray-500">
            {text.length}/{maxCharacters} characters
          </div>
          <button type="submit" className="btn btn-primary self-end">
            Submit
          </button>
        </form>
      </div>

      {/* Stories Div */}
      <div className="flex space-x-4">
        {/* English Story Div */}
        <div className="w-1/2 bg-blue-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">English Story</h2>
          <p>{englishMessage}</p>
        </div>
        {/* Finnish Story Div */}
        <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Finnish Story</h2>
          <p>{finnishMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
