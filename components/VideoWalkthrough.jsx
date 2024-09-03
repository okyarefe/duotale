"use client";
import React, { useState } from "react";

const VideoWalkthrough = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayWithSound = () => {
    const videoElement = document.getElementById("walkthroughVideo");
    videoElement.muted = false;
    videoElement
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.log("Play failed:", error);
      });
  };

  return (
    <div className="video-container">
      {!isPlaying && (
        <div className="overlay" onClick={handlePlayWithSound}>
          <p className="overlay-text">Click the video to enable sound</p>
        </div>
      )}
      <video
        id="walkthroughVideo"
        autoPlay
        loop
        muted
        className="video"
        style={{ width: "100%", height: "100%" }}
        onClick={handlePlayWithSound}
      >
        <source src="/walkthroughfinal2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoWalkthrough;
