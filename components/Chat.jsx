"use client";

import { useState, useEffect } from "react";

import { splitTextIntoSentences } from "../utils/helper";
import PopupComponent from "./Popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircleLoader } from "react-spinners";

import { generateChatResponse } from "../utils/actions";

const Chat = ({ token, userId }) => {
  const [text, setText] = useState("");
  const [englishSentences, setEnglishSentences] = useState([]);
  const [finnishSentences, setFinnishSentences] = useState([]);
  const [popupPosition, setPopupPosition] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userToken, setUserToken] = useState(token);
  const [isLoading, setIsLoading] = useState(false);
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
    console.log("Token received in Chat component:", userToken);
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
    if (userToken > estimatedTokenCost) {
      setIsLoading(true);
      try {
        const { englishStory, finnishStory, tokenUsed } =
          await generateChatResponse(text);
        setEnglishSentences(splitTextIntoSentences(englishStory));
        setFinnishSentences(splitTextIntoSentences(finnishStory));
        let newTokenAmount = token - tokenUsed;
        console.log("NEW TOKEN AMOUNT", newTokenAmount);
        // Store the responses in local storage
        localStorage.setItem("englishMessage", englishStory);
        localStorage.setItem("finnishMessage", finnishStory);
        setUserToken((prev) => prev - tokenUsed);
        toast.success("Your story has been generated!");

        toast.info(`You have used ${tokenUsed} tokens.`);
        toast.info(`You have ${newTokenAmount} tokens left.`);
        setIsLoading(false);
        return null;
      } catch (error) {
        console.error("Error generating response:", error);
      }
    }
    console.log("NOT ENOUGH TOKENS");
    toast.error("Not enough tokens");
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
    <div className="p-6 space-y-4 ">
      {/* Prompt Div */}
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
      <div className="bg-gray-100 p-4 rounded-lg shadow-md ">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <textarea
            maxLength={maxCharacters}
            value={text}
            required={true}
            onChange={(e) => setText(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Enter your prompt here..."
          />
          <div className="text-right text-sm text-gray-500 ">
            {text.length}/{maxCharacters} characters
          </div>
          <h1 className="special">
            You have <span className="color-red-100">{userToken}</span> tokens
            left
          </h1>
          <button
            type="submit"
            className="btn btn-primary self-end bg-blue-100 btn"
          >
            Submit
          </button>
        </form>
      </div>
      {isLoading ? (
        <div>
          <div className="loader-container">
            <CircleLoader />
          </div>
          <div className="loader-container">Please wait...</div>
        </div>
      ) : (
        <div
          className="flex space-x-4 storydivs"
          onContextMenu={(e) => handleContextMenu(e, highlightedIndex)}
        >
          {/* English Story Div */}
          <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md story-right-border">
            <h2 className="text-lg font-bold mb-2 story">English Story</h2>
            <p className="stories-color">
              {englishSentences.map((sentence, index) => (
                <span
                  key={index}
                  id={`english-sentence-${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  className={`mb-2 cursor-pointer  ${
                    highlightedIndex === index ? "bg-yellow-200 " : ""
                  }`}
                >
                  {sentence + " "}
                </span>
              ))}
            </p>
          </div>
          {/* Finnish Story Div */}
          <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md story-left-border">
            <h2 className="text-lg font-bold mb-2 story">Finnish Story</h2>
            <p className="stories-color">
              {finnishSentences.map((sentence, index) => (
                <span
                  key={index}
                  id={`finnish-sentence-${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  className={`mb-2 cursor-pointer ${
                    highlightedIndex === index ? "bg-yellow-200 " : ""
                  }`}
                >
                  {sentence + " "}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
      {/* Stories Div */}

      {popupPosition && (
        <PopupComponent x={popupPosition.x} y={popupPosition.y} />
      )}
    </div>
  );
};

export default Chat;
