"use client";
import React from "react";
import { useEffect } from "react";

const VideoWalkthrough = () => {
  useEffect(() => {
    const videoElement = document.getElementById("walkthroughVideo");

    // Play the video
    videoElement
      .play()
      .then(() => {
        // Unmute after a short delay
        setTimeout(() => {
          videoElement.muted = false;
        }, 500); // Adjust delay as needed
      })
      .catch((error) => {
        console.log("Auto-play was prevented by the browser.", error);
      });
  }, []);

  return (
    <div className="video-container">
      <video
        id="walkthroughVideo"
        autoPlay
        loop
        muted
        preload="auto"
        className="video"
        style={{ width: "100%", height: "100%" }}
      >
        <source src="/walkthroughfinal2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoWalkthrough;
