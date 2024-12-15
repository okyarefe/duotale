import { useState } from "react";
import PopupComponent from "./Popup";
import Spinner from "./Spinner";

const StoryDisplay = ({ isLoading, englishSentences, finnishSentences }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleMouseOver = (index) => {
    if (!isPopupOpen) {
      setHighlightedIndex(index);
    }
  };

  const handleMouseOut = () => {
    if (!isPopupOpen) {
      setHighlightedIndex(null);
    }
  };

  const handleContextMenu = (e, index, sentence) => {
    e.preventDefault();
    setPopupPosition({ x: e.pageX, y: e.pageY });
    setSelectedSentence(sentence);
    setIsPopupOpen(true);
    setHighlightedIndex(index);
  };

  const handleClosePopup = () => {
    setPopupPosition(null);
    setIsPopupOpen(false);
    setHighlightedIndex(null);
    setSelectedSentence("");
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
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
                    highlightedIndex === index ? "bg-yellow-200" : ""
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
                    highlightedIndex === index ? "bg-yellow-200" : ""
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
          handlePopupButtonClick={handleClosePopup}
        />
      )}
    </div>
  );
};

export default StoryDisplay;
