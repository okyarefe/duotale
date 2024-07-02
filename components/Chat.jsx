"use client";

import { useState, useEffect } from "react";
import { generateChatResponse } from "../utils/actions";
import { splitTextIntoSentences } from "../utils/helper";
import PopupComponent from "./Popup";

const Chat = ({ token, userId }) => {
  const [text, setText] = useState("");
  const [englishSentences, setEnglishSentences] = useState([]);
  const [finnishSentences, setFinnishSentences] = useState([]);
  const [popupPosition, setPopupPosition] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const estimatedTokenCost = 1000;

  const maxCharacters = 100;

  // Retrieve stored responses when component mounts
  useEffect(() => {
    const storedEnglishMessage = localStorage.getItem("englishMessage");
    const storedFinnishMessage = localStorage.getItem("finnishMessage");
    if (storedEnglishMessage)
      setEnglishSentences(splitTextIntoSentences(storedEnglishMessage));
    if (storedFinnishMessage)
      setFinnishSentences(splitTextIntoSentences(storedFinnishMessage));
  }, []);

  useEffect(() => {
    // Attach click event listener to document to handle clicks outside the popup
    const handleDocumentClick = (e) => {
      if (!e.target.closest(".popup")) {
        setPopupPosition(null); // Close popup if click is outside the popup
        setIsPopupOpen(false); // Reset the popup state
        setHighlightedIndex(null); // Reset the highlighted sentence
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token > estimatedTokenCost) {
      try {
        const { englishStory, finnishStory, tokenUsed } =
          await generateChatResponse(text);
        setEnglishSentences(splitTextIntoSentences(englishStory));
        setFinnishSentences(splitTextIntoSentences(finnishStory));

        // Store the responses in local storage
        localStorage.setItem("englishMessage", englishStory);
        localStorage.setItem("finnishMessage", finnishStory);
      } catch (error) {
        console.error("Error generating response:", error);
      }
    }
  };

  const handleMouseOver = (index) => {
    if (!isPopupOpen) {
      setHighlightedIndex(index);
    }
  };

  const handleMouseOut = (index) => {
    if (!isPopupOpen) {
      setHighlightedIndex(null);
    }
  };

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setPopupPosition({ x: e.pageX, y: e.pageY }); // Store mouse coordinates
    setIsPopupOpen(true);
    setHighlightedIndex(index); // Lock the highlighted sentence
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
          <h1 className="special">YOU HAVE {token} TOKENS LEFT</h1>
          <button type="submit" className="btn btn-primary self-end">
            Submit
          </button>
        </form>
      </div>

      {/* Stories Div */}
      <div
        className="flex space-x-4"
        onContextMenu={(e) => handleContextMenu(e, highlightedIndex)}
      >
        {/* English Story Div */}
        <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">English Story</h2>
          <p className="color-white-100">
            {englishSentences.map((sentence, index) => (
              <span
                key={index}
                id={`english-sentence-${index}`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={() => handleMouseOut(index)}
                className={highlightedIndex === index ? "highlight" : ""}
              >
                {sentence + " "}
              </span>
            ))}
          </p>
        </div>
        {/* Finnish Story Div */}
        <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Finnish Story</h2>
          <p className="color-white-100">
            {finnishSentences.map((sentence, index) => (
              <span
                key={index}
                id={`finnish-sentence-${index}`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={() => handleMouseOut(index)}
                className={highlightedIndex === index ? "highlight" : ""}
              >
                {sentence + " "}
              </span>
            ))}
          </p>
        </div>
      </div>

      {popupPosition && (
        <PopupComponent x={popupPosition.x} y={popupPosition.y} />
      )}
    </div>
  );
};

export default Chat;
