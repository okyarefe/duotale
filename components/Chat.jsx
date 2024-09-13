"use client";

import { useState, useEffect } from "react";
import { languagesList, splitTextIntoSentences } from "../utils/helper";

import PopupComponent from "./Popup";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { CircleLoader } from "react-spinners";
import { generateChatResponse } from "../utils/actions";
import Dropdown from "./Dropdown";
import Chooselanguage from "./Chooselanguage";

const Chat = ({ token, daily_free_translations }) => {
  const [userToken, setUserToken] = useState(token);
  const [user_daily_free_translations, setUserDailyFreeTranslations] = useState(
    daily_free_translations
  );

  const [englishSentences, setEnglishSentences] = useState([]);
  const [finnishSentences, setFinnishSentences] = useState([]);
  const [translateTo, setTranslateTo] = useState("Finnish");
  const [text, setText] = useState("");
  /*End of sentences*/

  const [popupPosition, setPopupPosition] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  /*Tokens*/

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

  const languageToTranslate = (lang) => {
    console.log("Translating to:", lang);
    setTranslateTo(lang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userToken > estimatedTokenCost) {
      setIsLoading(true);

      try {
        const { englishStory, translatedStory, tokenUsed } =
          await generateChatResponse(text, translateTo);
        setEnglishSentences(splitTextIntoSentences(englishStory));
        setFinnishSentences(splitTextIntoSentences(translatedStory));
        let newTokenAmount = userToken - tokenUsed;

        // Store the responses in local storage
        localStorage.setItem("englishMessage", englishStory);
        localStorage.setItem("finnishMessage", translatedStory);
        setUserToken((prev) => prev - tokenUsed);
        toast.success("Your story has been generated!");

        toast.info(`You have used ${tokenUsed} tokens.`);
        toast.info(`You have ${newTokenAmount} tokens left.`);

        setIsLoading(false);
        return;
      } catch (error) {
        setIsLoading(false);
        throw new Error("Error occured while rendering .", error);
      }
    } else {
      toast.warn("You do not have enough tokens to generate a story.");
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

  const handlePopupButtonClick = () => {
    try {
      setPopupPosition(null);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error handling button click:", error);
    }
  };

  if (!token || !daily_free_translations) {
    return <p>Loading...</p>; // Fallback while waiting for the data
  }
  return (
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
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <textarea
            maxLength={maxCharacters}
            value={text}
            required={true}
            onChange={(e) => setText(e.target.value)}
            className="textarea textarea-bordered w-full prompt-text-size"
            placeholder="Enter your prompt here..."
          />
          <div className="text-right text-sm text-gray-500">
            {text.length}/{maxCharacters} characters
          </div>
          {/* DROPDOWN COMPONENT */}
          <Chooselanguage translateTo={translateTo}>
            <Dropdown
              label={"Choose a language pair - Translate to "}
              items={languagesList}
              onSelect={languageToTranslate}
            ></Dropdown>
          </Chooselanguage>

          {/* TOKEN TEXT*/}
          <div className="flex gap-5">
            <h1
              className="special"
              style={{
                border: "2px solid black",
                padding: "10px",
                display: "inline-block",
              }}
            >
              You have <span className="color-red-100">{userToken}</span> tokens
              left
            </h1>
            <h1
              className="special"
              style={{
                border: "2px solid black",
                padding: "10px",
                display: "inline-block",
              }}
            >
              You have{" "}
              <span className="color-red-100">{daily_free_translations}</span>{" "}
              free daily word translations
            </h1>
          </div>

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
            <h2 className="text-lg font-bold mb-2 story">Translated Story</h2>
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
          handlePopupButtonClick={handlePopupButtonClick}
        />
      )}
    </div>
  );
};

export default Chat;
