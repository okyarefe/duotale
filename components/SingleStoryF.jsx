"use client";
import { useState, useEffect } from "react";
import { splitTextIntoSentences } from "../utils/helper";
import PopupComponent from "./Popup";

const SingleStoryF = ({ story }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
                {sentence}
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
                {sentence}
              </p>
            )
          )}
        </div>
      </div>
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

export default SingleStoryF;

// "use client";
// import { useState } from "react";
// import { splitTextIntoSentences } from "../utils/helper";

// const SingleStoryF = ({ story }) => {
//   const [highlightedIndex, setHighlightedIndex] = useState(null);

//   // Function to handle mouse over a sentence
//   const handleMouseOver = (index) => {
//     setHighlightedIndex(index);
//   };

//   // Function to handle mouse out from a sentence
//   const handleMouseOut = () => {
//     setHighlightedIndex(null);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-extrabold mb-6 text-black">
//         Story Detail Page
//       </h1>
//       <div className="flex space-x-6">
//         {/* English Story */}
//         <div className="flex-1 bg-white border rounded-lg shadow-md p-4 text-black">
//           <h2 className="text-lg font-bold mb-2">English Story:</h2>
//           {splitTextIntoSentences(story.english_story).map(
//             (sentence, index) => (
//               <p
//                 key={index}
//                 className={`mb-2 cursor-pointer ${
//                   highlightedIndex === index ? "bg-yellow-200" : ""
//                 }`}
//                 onMouseOver={() => handleMouseOver(index)}
//                 onMouseOut={handleMouseOut}
//               >
//                 {sentence}
//               </p>
//             )
//           )}
//         </div>

//         {/* Finnish Story */}
//         <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-md p-4 text-black">
//           <h2 className="text-lg font-bold mb-2">Finnish Story:</h2>
//           {splitTextIntoSentences(story.finnish_story).map(
//             (sentence, index) => (
//               <p
//                 key={index}
//                 className={`mb-2 cursor-pointer ${
//                   highlightedIndex === index ? "bg-yellow-200" : ""
//                 }`}
//                 onMouseOver={() => handleMouseOver(index)}
//                 onMouseOut={handleMouseOut}
//               >
//                 {sentence}
//               </p>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleStoryF;
