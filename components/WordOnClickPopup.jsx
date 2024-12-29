import { useState, useEffect, useRef } from "react";

import { fetchTranslateWord } from "@/utils/actions";
import WordOnClickTranslation from "./WordOnClickTranslation";
import { Button } from "./ui/button";
import SmallSpinner from "./SmallSpinner";
import { toast } from "react-toastify";

const WordOnClickPopup = ({ word, x, y, onClose, setWordPopup, wordPopup }) => {
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [wordTranslation, setWordTranslation] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(true);

  const popupRef = useRef(null); // Ref to the popup div
  useEffect(() => {
    // Reset button visibility when the word or showTranslation changes
    setButtonVisible(true);
  }, [word, showTranslation]);
  useEffect(() => {
    // Close the popup when clicking outside of it
    function handleClickOutside(event) {
      console.log("clicking outside");
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (wordPopup.show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wordPopup.show]);

  const handleTranslateClick = async () => {
    setButtonVisible(false);
    // setWordPopup({ show: false, word: "", x: 0, y: 0 });
    await fetchWordMeaning(word);
  };

  const fetchWordMeaning = async (word) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const cachedMeaning = localStorage.getItem(`wordMeaning_${word}`);
      // if the meaning is cached, use it
      if (cachedMeaning) {
        console.log("************************** FROM CACHE");
        const wordTranslation = JSON.parse(cachedMeaning);
        setWordTranslation(wordTranslation);
        setTranslation(wordTranslation);
        setIsLoading(false);
        setShowTranslation(true);
        return;
      }

      // if the meaning is not cached, fetch it
      try {
        const result = await fetchTranslateWord(word);
        if (result.error) {
          toast.error(result.error);

          setIsError(true);
          setShowTranslation(false);
          setWordPopup({ show: false, word: "", x: 0, y: 0 });
        } else {
          const { wordTranslation, tokenUsed } = result;
          // setUserDailyTranslation((prev) => prev - 1);
          // You can update the state or perform any other action with the translation here
          localStorage.setItem(
            `wordMeaning_${word}`,
            JSON.stringify(wordTranslation)
          );

          setWordTranslation(wordTranslation);
          setTranslation(wordTranslation); // Update the translation state
          setShowTranslation(true);
        }
      } catch (error) {
        console.log("Error", error);
        setIsError(true);
        setShowTranslation(false);
        alert(error.message);
      }
    } catch (error) {
      toast.error("Error translating..Please try again later");
      console.log("Error", error);
      setWordPopup({ show: false, word: "", x: 0, y: 0 });
      setShowTranslation(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {wordPopup.show && (
        <div
          ref={popupRef}
          className="word-translation-popup flex flex-col gap-3"
          style={{
            position: "fixed",
            left: `${x}px`,
            top: `${y}px`,
            background: "white",
            border: "1px solid #4f46e5",
            borderRadius: "8px",
            padding: "11px",
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {showTranslation ? (
            <WordOnClickTranslation
              word={word}
              x={x}
              y={y}
              onClose={() => setShowTranslation(false)}
              isError={isError}
              isLoading={isLoading}
              translatedWord={translation}
              setShowTranslation={setShowTranslation}
              closePopup={onClose}
              showTranslation={showTranslation}
            />
          ) : isLoading ? (
            <div className="wordloading flex items-center justify-center min-h-[40px]">
              <SmallSpinner />
            </div>
          ) : (
            buttonVisible && (
              <Button
                onClick={handleTranslateClick}
                disabled={isLoading}
                className="bg-white text-gray-900 border border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                Translate
              </Button>
            )
          )}
          <Button
            disabled
            className="bg-white text-gray-900 border border-indigo-500 opacity-50"
          >
            Coming Soon
          </Button>
          <Button
            disabled
            className="bg-white text-gray-900 border border-indigo-500 opacity-50"
          >
            Coming Soon
          </Button>
        </div>
      )}
    </>
  );
};

export default WordOnClickPopup;
