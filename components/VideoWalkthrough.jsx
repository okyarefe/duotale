"use client";
import React from "react";

const VideoWalkthrough = () => {
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
