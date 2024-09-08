"use client";
import { useState, useEffect } from "react";
import { splitTextIntoSentences } from "../utils/helper";
import PopupComponent from "./Popup";
import WordTranslationPopup from "./WordTranslationPopup";
import { fetchTranslateWord } from "../utils/actions";
import { ToastContainer, toast } from "react-toastify";
const SingleStoryF = ({ story }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [highlightedWord, setHighlightedWord] = useState(null);
  const [wordTranslation, setWordTranslation] = useState(null);
  const [wordPopup, setWordPopup] = useState({
    show: false,
    word: "",
    x: 0,
    y: 0,
  });
  // Function to handle mouse over a sentence
  const handleMouseOver = (index) => {
    if (!isPopupOpen) {
      setHighlightedIndex(index);
    }
  };

  // Function to handle mouse out from a sentence
  const handleMouseOut = () => {
    if (!isPopupOpen) {
      setHighlightedIndex(null);
    }
  };

  // Function to handle right-click (context menu) on a sentence
  const handleContextMenu = (e, index, sentence) => {
    e.preventDefault();
    setPopupPosition({ x: e.pageX, y: e.pageY }); // Store mouse coordinates
    setSelectedSentence(sentence); // Store the selected sentence
    setIsPopupOpen(true);
    setHighlightedIndex(index); // Lock the highlighted sentence
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setPopupPosition(null);
    setIsPopupOpen(false);
    setHighlightedIndex(null);
    setSelectedSentence("");
  };

  // Attach and remove event listeners to handle clicks outside the popup
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest(".popup")) {
        handleClosePopup();
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Updated function to split sentence into words and render them
  // Updated function to handle mouse over a word
  const handleWordMouseOver = (word) => {
    setHighlightedWord(word);
  };

  // Updated function to handle mouse out from a word
  const handleWordMouseOut = () => {
    setHighlightedWord(null);
  };

  // Updated function to split sentence into words and render them
  const renderWords = (sentence) => {
    return sentence.split(/\s+/).map((word, wordIndex) => (
      <span
        key={wordIndex}
        className={`cursor-pointer ${
          highlightedWord === word ? "text-red-500" : ""
        }`}
        onMouseOver={() => handleWordMouseOver(word)}
        onMouseOut={handleWordMouseOut}
        onClick={() => handleWordClick(event, word)}
      >
        {word}{" "}
      </span>
    ));
  };

  // Close Word Popup
  const closeWordPopup = () => {
    setWordPopup({ show: false, word: "", x: 0, y: 0 });
  };

  // Fetch Word meaning on click
  // Fetch Word meaning on click

  const fetchWordMeaning = async (word) => {
    try {
      const cachedMeaning = localStorage.getItem(`wordMeaning_${word}`);
      // if the meaning is cached, use it
      if (cachedMeaning) {
        console.log("Meaning found in cache");
        const wordTranslation = JSON.parse(cachedMeaning);
        setWordTranslation(wordTranslation);
        console.log(
          `Translation for "${word}": ${wordTranslation} saved to the LOCAL STORAGE`
        );
        return;
      }

      // if the meaning is not cached, fetch it
      const { wordTranslation, tokenUsed } = await fetchTranslateWord(word);
      console.log(`Translation for "${word}": ${wordTranslation}`);
      console.log(`Tokens used: ${tokenUsed}`);
      // You can update the state or perform any other action with the translation here
      localStorage.setItem(
        `wordMeaning_${word}`,
        JSON.stringify(wordTranslation)
      );

      setWordTranslation(wordTranslation);

      // For example, you could update the WordTranslationPopup component to display the translation
    } catch (error) {
      toast.error("Error translating..Please try again later");
      setWordPopup({ show: false, word: "", x: 0, y: 0 });
    }
  };

  // on click WORD
  const handleWordClick = (event, word) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    setWordPopup({ show: true, word, x: clientX - 145, y: clientY - 65 });
    fetchWordMeaning(word);
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
                onContextMenu={(e) => handleContextMenu(e, index, sentence)}
              >
                {renderWords(sentence)}
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
                onContextMenu={(e) => handleContextMenu(e, index, sentence)}
              >
                {renderWords(sentence)}
              </p>
            )
          )}
        </div>
      </div>
      {wordPopup.show && (
        <WordTranslationPopup
          word={wordPopup.word}
          x={wordPopup.x}
          y={wordPopup.y}
          onClose={closeWordPopup}
          translatedWord={wordTranslation}
        />
      )}
      {popupPosition && (
        <PopupComponent
          x={popupPosition.x}
          y={popupPosition.y}
          sentence={selectedSentence}
          onClose={handleClosePopup}
          handlePopupButtonClick={handleClosePopup}
        />
      )}
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
    </div>
  );
};

export default SingleStoryF;
