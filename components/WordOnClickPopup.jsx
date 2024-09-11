import { useState, useEffect, useRef } from "react";
import Spinner from "./Spinner";
import { fetchTranslateWord } from "@/utils/actions";
import WordOnClickTranslation from "./WordOnClickTranslation";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { ToastContainer, toast } from "react-toastify";

const WordOnClickPopup = ({
  word,
  x,
  y,
  onClose,

  setWordPopup,
  wordPopup,
}) => {
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [wordTranslation, setWordTranslation] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(true);
  const { userId } = useAuth();
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
        const result = await fetchTranslateWord(word, userId);
        if (result.error) {
          // toast.error(result.error);
          alert(result.error);
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
        alert("Error translating..Please try again later");
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
            border: "1px solid black",
            borderRadius: "1px",
            padding: "11px",
            zIndex: 1000,
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
            <div style={{ height: "50px" }}>
              <Spinner size={20} color="black" />
            </div>
          ) : (
            buttonVisible && (
              <Button
                onClick={handleTranslateClick}
                disabled={isLoading}
                style={{ height: "40px" }}
              >
                Translate
              </Button>
            )
          )}
          <Button style={{ height: "40px" }}>Add to Practice List</Button>
        </div>
      )}
    </>
  );
};

export default WordOnClickPopup;
