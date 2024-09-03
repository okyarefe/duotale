"use client";
import React, { useEffect } from "react";

const VideoWalkthrough = () => {
  useEffect(() => {
    const videoElement = document.getElementById("walkthroughVideo");

    // Attempt to play the video immediately
    videoElement.play().catch((error) => {
      console.log("Auto-play was prevented by the browser.", error);
    });

    // Unmute the video when the user hovers over the screen
    const handleMouseMove = () => {
      videoElement.muted = false;
      videoElement.play().catch((error) => {
        console.log("Auto-play was prevented by the browser.", error);
      });

      // Remove the event listener after unmuting to prevent repeated triggers
      document.removeEventListener("mousemove", handleMouseMove);
    };

    // Listen for mouse movement to unmute the video
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      // Clean up event listener when the component unmounts
      document.removeEventListener("mousemove", handleMouseMove);
    };
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
