"use client";

import { useState, useEffect } from "react";
import ErrorComponent from "./ErrorComponent";
import { splitTextIntoSentences } from "../utils/helper";
import PopupComponent from "./Popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircleLoader } from "react-spinners";
import { generateChatResponse } from "../utils/actions";

const Chat = ({ token }) => {
  const [text, setText] = useState("");
  const [englishSentences, setEnglishSentences] = useState([]);
  const [finnishSentences, setFinnishSentences] = useState([]);
  const [popupPosition, setPopupPosition] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userToken, setUserToken] = useState(token);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
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
        setSelectedSentence(""); // Reset the selected sentence
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
        toast.warn("An error occurred while saving the story.");
        setIsError(true);
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

  const handleContextMenu = (e, index, sentence) => {
    e.preventDefault();
    setPopupPosition({ x: e.pageX, y: e.pageY }); // Store mouse coordinates
    setSelectedSentence(sentence); // Store the selected sentence
    setIsPopupOpen(true);
    setHighlightedIndex(index); // Lock the highlighted sentence
  };

  const handleClosePopup = () => {
    setPopupPosition(null);
    setIsPopupOpen(false);
    setHighlightedIndex(null);
    setSelectedSentence("");
  };

  if (isError) {
    return <ErrorComponent />;
  }

  return (
    <div className="p-6 space-y-4">
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
          <h1 className="special">
            You have <span className="color-red-100">{userToken}</span> tokens
            left
          </h1>
          <button
            type="submit"
            className="btn btn-primary self-end bg-blue-100 btn"
            disabled={isLoading}
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
        <div className="flex space-x-4 storydivs">
          <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md story-right-border">
            <h2 className="text-lg font-bold mb-2 story">English Story</h2>
            <p className="stories-color">
              {englishSentences.map((sentence, index) => (
                <span
                  key={index}
                  id={`english-sentence-${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  onContextMenu={(e) => handleContextMenu(e, index, sentence)}
                  className={`mb-2 cursor-pointer ${
                    highlightedIndex === index ? "bg-yellow-200 " : ""
                  }`}
                >
                  {sentence + " "}
                </span>
              ))}
            </p>
          </div>
          <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md story-left-border">
            <h2 className="text-lg font-bold mb-2 story">Finnish Story</h2>
            <p className="stories-color">
              {finnishSentences.map((sentence, index) => (
                <span
                  key={index}
                  id={`finnish-sentence-${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  onContextMenu={(e) => handleContextMenu(e, index, sentence)}
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
      {popupPosition && (
        <PopupComponent
          x={popupPosition.x}
          y={popupPosition.y}
          sentence={selectedSentence}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Chat;
