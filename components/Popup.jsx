"use client";

import { fetchAudio } from "../utils/actions";
import SmallSpinner from "../components/SmallSpinner";
import ErrorComponent from "./ErrorComponent";

import { useState } from "react";

const PopupComponent = ({ x, y, sentence, handlePopupButtonClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Fetch the audio file
      const mp3 = await fetchAudio(sentence);
      if (mp3) {
        const audio = new Audio(mp3);
        audio.play();
      } else {
        const audio = new Audio(
          `/speech.mp3?timestamp=${new Date().getTime()}`
        );
        audio.play();
      }

      //Play the newly fetched audio

      setIsLoading(false);

      handlePopupButtonClick();
    } catch (error) {
      console.error("Error in handleOnClick:", error.digest);
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isError ? (
        <ErrorComponent />
      ) : (
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
          <button
            onClick={handleOnClick}
            disabled={isLoading}
            className={`button ${isLoading ? "disabled" : ""}`}
          >
            <span className="voice">Voice {isLoading && <SmallSpinner />}</span>
          </button>
        </div>
      )}
    </>
  );
};

export default PopupComponent;
