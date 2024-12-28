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
    <div className="bg-slate-200 p-4 rounded-lg shadow-lg border-2 border-indigo">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex space-x-8">
          <div className="w-1/2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-indigo-50 transition-all hover:shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-indigo-700">
              English Story
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {englishSentences.map((sentence, index) => (
                <span
                  key={index}
                  id={`english-sentence-${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  onContextMenu={(e) => handleContextMenu(e, index, sentence)}
                  className={`mb-2 cursor-pointer transition-colors ${
                    highlightedIndex === index ? "bg-indigo-200" : ""
                  }`}
                >
                  {sentence + " "}
                </span>
              ))}
            </p>
          </div>
          <div className="w-1/2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-indigo-50 transition-all hover:shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-indigo-700">
              Translated Story
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {finnishSentences.map((sentence, index) => (
                <span
                  key={index}
                  id={`finnish-sentence-${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  onContextMenu={(e) => handleContextMenu(e, index, sentence)}
                  className={`mb-2 cursor-pointer transition-colors ${
                    highlightedIndex === index ? "bg-indigo-200" : ""
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
