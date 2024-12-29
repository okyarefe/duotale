"use client";

import { useEffect, useRef } from "react";
import { fetchAudio } from "../utils/actions";
import SmallSpinner from "../components/SmallSpinner";
import ErrorComponent from "./ErrorComponent";
import { playTheMp3 } from "@/utils/helper";
import { useState } from "react";

const PopupComponent = ({
  x,
  y,
  sentence,
  handlePopupButtonClick,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Fetch the audio file
      const mp3 = await fetchAudio(sentence);
      playTheMp3(mp3);

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
          ref={popupRef}
          className="popup"
          style={{
            position: "fixed",
            paddingLeft: "25px", // Padding on the left
            paddingRight: "25px", // Padding on the right
            left: `${x + 50}px`,
            top: `${y - 20}px`,
            background: "white",
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
            <span className="text-indigo-700">
              {isLoading ? <SmallSpinner /> : "Listen"}
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default PopupComponent;
