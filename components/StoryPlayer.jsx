import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { fetchAudio } from "@/utils/actions";
import { debounce } from "lodash";
import SmallSpinner from "./SmallSpinner";

const StoryPlayer = ({ storyToAudio }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const debouncedFetchAudio = useRef(
    debounce(async (a) => {
      const mp3 = await fetchAudio(a);
      setIsLoading(false);
      if (mp3) {
        // Create a new Audio object and store it in the ref
        audioRef.current = new Audio(mp3);
        audioRef.current.play();
        setIsPlaying(true);

        // Handle end of playback to reset state
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
    }, 500) // Adjust debounce time as needed
  ).current;

  const handleListenStory = async (a) => {
    setIsLoading(true);
    debouncedFetchAudio(a);
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset the playback position to the beginning
      setIsPlaying(false);
    }
  };

  return (
    <div class="flex items-center gap-4">
      <div>
        <Button
          onClick={() => handleListenStory(storyToAudio)}
          disabled={isLoading}
        >
          {isLoading ? (
            <div class="w-24 h-18 text-center">
              <SmallSpinner></SmallSpinner>
            </div>
          ) : (
            <h1 class="w-24 h-18 text-center">Listen</h1>
          )}
        </Button>
      </div>
      <div>
        <Button onClick={handlePause} disabled={!isPlaying}>
          Pause
        </Button>
        <Button
          onClick={handleResume}
          disabled={isPlaying || !audioRef.current}
        >
          Resume
        </Button>
        <Button onClick={handleStop} disabled={!audioRef.current}>
          Stop
        </Button>
      </div>
    </div>
  );
};

export default StoryPlayer;
