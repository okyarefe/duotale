"use client";

import { fetchAudio } from "../utils/actions";

const PopupComponent = ({ x, y, sentence }) => {
  const handleOnClick = async () => {
    try {
      console.log("Button clicked", sentence);
      const mp3 = await fetchAudio(sentence);
      console.log("MP3", mp3);
      const audio = new Audio(`/speech.mp3?timestamp=${new Date().getTime()}`);
      audio.play();
    } catch (error) {
      console.error("Error in handleOnClick:", error);
    }
  };

  return (
    <div
      className="popup"
      style={{
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        background: "yellow",
        border: "1px solid black",
        padding: "10px",
        zIndex: 1000, // Ensure it's above other content
      }}
    >
      <button onClick={handleOnClick}>Voice</button>
    </div>
  );
};

export default PopupComponent;
