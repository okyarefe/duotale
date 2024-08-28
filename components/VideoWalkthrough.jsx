import { headers } from "next/headers";
import React from "react";

const VideoWalkthrough = () => {
  return (
    <div className="video-container">
      <video
        autoPlay
        loop
        className="video"
        style={{ width: "80%", height: "90%" }}
      >
        <source src="/walkthroughfinal2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoWalkthrough;
