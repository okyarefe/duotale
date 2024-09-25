"use client";

import { useState, useEffect } from "react";
import { languagesList, splitTextIntoSentences } from "../utils/helper";
import PopupComponent from "./Popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateChatResponse } from "../utils/actions";
import Dropdown from "./Dropdown";
import Chooselanguage from "./Chooselanguage";
import Spinner from "./Spinner";

const Chat = ({ token, daily_free_translations, paid_tokens }) => {
  const [userToken, setUserToken] = useState(token);
  const [userDailyFreeTranslations, setUserDailyFreeTranslations] = useState(
    daily_free_translations
  );
  const [paidTokens, setPaidTokens] = useState(paid_tokens);

  const [englishSentences, setEnglishSentences] = useState([]);
  const [finnishSentences, setFinnishSentences] = useState([]);
  const [translateTo, setTranslateTo] = useState("Finnish");
  const [text, setText] = useState("");

  const [popupState, setPopupState] = useState({
    position: null,
    isOpen: false,
    highlightedIndex: null,
    selectedSentence: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const estimatedTokenCost = 1000;
  const maxCharacters = 100;

  useEffect(() => {
    loadStoredResponses();
    setupDocumentClickListener();
  }, []);

  const loadStoredResponses = () => {
    const storedEnglishMessage = localStorage.getItem("englishMessage");
    const storedFinnishMessage = localStorage.getItem("finnishMessage");
    if (storedEnglishMessage)
      setEnglishSentences(splitTextIntoSentences(storedEnglishMessage));
    if (storedFinnishMessage)
      setFinnishSentences(splitTextIntoSentences(storedFinnishMessage));
  };

  const setupDocumentClickListener = () => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest(".popup")) {
        resetPopupState();
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  };

  const resetPopupState = () => {
    setPopupState({
      position: null,
      isOpen: false,
      highlightedIndex: null,
      selectedSentence: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userToken <= estimatedTokenCost) {
      toast.warn("You do not have enough tokens to generate a story.");
      return;
    }

    setIsLoading(true);
    try {
      const { englishStory, translatedStory, tokenUsed } =
        await generateChatResponse(text, translateTo);
      updateStories(englishStory, translatedStory);
      updateTokens(tokenUsed);
      showSuccessToasts(tokenUsed);
    } catch (error) {
      console.error("Error occurred while rendering:", error);
      toast.error("An error occurred while generating the story.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStories = (englishStory, translatedStory) => {
    setEnglishSentences(splitTextIntoSentences(englishStory));
    setFinnishSentences(splitTextIntoSentences(translatedStory));
    localStorage.setItem("englishMessage", englishStory);
    localStorage.setItem("finnishMessage", translatedStory);
  };

  const updateTokens = (tokenUsed) => {
    setUserToken((prev) => prev - tokenUsed);
  };

  const showSuccessToasts = (tokenUsed) => {
    toast.success("Your story has been generated!");
    toast.info(`You have used ${tokenUsed} tokens.`);
    toast.info(`You have ${userToken - tokenUsed} tokens left.`);
  };

  const handleSentenceInteraction = (action, index, sentence) => {
    if (action === "mouseOver" && !popupState.isOpen) {
      setPopupState((prev) => ({ ...prev, highlightedIndex: index }));
    } else if (action === "mouseOut" && !popupState.isOpen) {
      setPopupState((prev) => ({ ...prev, highlightedIndex: null }));
    } else if (action === "contextMenu") {
      setPopupState({
        position: { x: event.pageX, y: event.pageY },
        isOpen: true,
        highlightedIndex: index,
        selectedSentence: sentence,
      });
    }
  };

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
          <Chooselanguage translateTo={translateTo}>
            <Dropdown
              label={"Choose a language pair - Translate to "}
              items={languagesList}
              onSelect={setTranslateTo}
            />
          </Chooselanguage>
          <TokenDisplay
            userToken={userToken}
            dailyFreeTranslations={userDailyFreeTranslations}
            paidTokens={paidTokens}
          />
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
        <LoadingIndicator />
      ) : (
        <StoryDisplay
          englishSentences={englishSentences}
          finnishSentences={finnishSentences}
          handleSentenceInteraction={handleSentenceInteraction}
          highlightedIndex={popupState.highlightedIndex}
        />
      )}
      {popupState.position && (
        <PopupComponent
          x={popupState.position.x}
          y={popupState.position.y}
          sentence={popupState.selectedSentence}
          onClose={resetPopupState}
          handlePopupButtonClick={resetPopupState}
        />
      )}
    </div>
  );
};

const TokenDisplay = ({ userToken, dailyFreeTranslations, paidTokens }) => (
  <div className="flex gap-5">
    <TokenInfo label="tokens left" value={userToken} />
    <TokenInfo
      label="free daily word translations"
      value={dailyFreeTranslations}
    />
    <TokenInfo label="paid word translations" value={paidTokens} />
  </div>
);

const TokenInfo = ({ label, value }) => (
  <h1
    className="special"
    style={{
      border: "2px solid black",
      padding: "10px",
      display: "inline-block",
    }}
  >
    You have <span className="color-red-100 text-xl">{value}</span> {label}
  </h1>
);

const LoadingIndicator = () => (
  <div>
    <div className="loader-container">Please wait...</div>
    <div className="loader-container">
      <Spinner />
    </div>
  </div>
);

const StoryDisplay = ({
  englishSentences,
  finnishSentences,
  handleSentenceInteraction,
  highlightedIndex,
}) => (
  <div className="flex space-x-4 storydivs">
    <StorySection
      title="English Story"
      sentences={englishSentences}
      handleSentenceInteraction={handleSentenceInteraction}
      highlightedIndex={highlightedIndex}
    />
    <StorySection
      title="Translated Story"
      sentences={finnishSentences}
      handleSentenceInteraction={handleSentenceInteraction}
      highlightedIndex={highlightedIndex}
    />
  </div>
);

const StorySection = ({
  title,
  sentences,
  handleSentenceInteraction,
  highlightedIndex,
}) => (
  <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md story-right-border">
    <h2 className="text-lg font-bold mb-2 story">{title}</h2>
    <p className="stories-color">
      {sentences.map((sentence, index) => (
        <span
          key={index}
          onMouseOver={() =>
            handleSentenceInteraction("mouseOver", index, sentence)
          }
          onMouseOut={() =>
            handleSentenceInteraction("mouseOut", index, sentence)
          }
          onContextMenu={(e) => {
            e.preventDefault();
            handleSentenceInteraction("contextMenu", index, sentence);
          }}
          className={`mb-2 cursor-pointer ${
            highlightedIndex === index ? "bg-yellow-200 " : ""
          }`}
        >
          {sentence + " "}
        </span>
      ))}
    </p>
  </div>
);

export default Chat;
