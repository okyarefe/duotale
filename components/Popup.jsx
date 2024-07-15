"use client";

import { fetchAudio } from "../utils/actions";
import Spinner from "../components/Spinner";
import { useState } from "react";

const PopupComponent = ({ x, y, sentence, handlePopupButtonClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    try {
      setIsLoading(true);

      const mp3 = await fetchAudio(sentence);

      const audio = new Audio(`/speech.mp3?timestamp=${new Date().getTime()}`);
      audio.play();

      setIsLoading(false);
      handlePopupButtonClick();
    } catch (error) {
      console.error("Error in handleOnClick:", error.digest);
    }
  };

  return (
    <>
      <div
        className="popup"
        style={{
          position: "fixed",
          paddingLeft: "25px", // Padding on the left
          paddingRight: "25px", // Padding on the right
          left: `${x + 50}px`,
          top: `${y - 20}px`,
          background: "lightblue",
          borderRadius: "5px",
          border: "1px solid black",
          zIndex: 1000, // Ensure it's above other content
        }}
      >
        {isLoading ? <Spinner /> : null}
        <button onClick={handleOnClick}>
          <span className="voice">Voice</span>
        </button>
      </div>
    </>
  );
};

export default PopupComponent;
