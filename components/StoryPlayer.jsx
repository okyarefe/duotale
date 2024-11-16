import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { fetchAudio } from "@/utils/actions";
import { debounce } from "lodash";
import SmallSpinner from "./SmallSpinner";
import { toast } from "react-toastify";

const StoryPlayer = ({ storyToAudio }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Track the current progress (in seconds)
  const [duration, setDuration] = useState(0); // Track the duration of the audio (in seconds)

  const audioRef = useRef(null);
  const intervalRef = useRef(null); // To update the progress periodically

  const debouncedFetchAudio = useRef(
    debounce(async (a) => {
      console.log("Debounce run!");
      setIsLoading(true);
      try {
        const mp3 = await fetchAudio(a);

        if (mp3) {
          // Create a new Audio object and store it in the ref
          setIsLoading(false);
          audioRef.current = new Audio(mp3);
        } else {
          audioRef.current = new Audio(
            `/speech.mp3?timestamp=${new Date().getTime()}`
          );
        }

        // Set the audio duration once metadata is loaded
        audioRef.current.onloadedmetadata = () => {
          setDuration(audioRef.current.duration);
        };

        // Start playing the audio
        audioRef.current.play();
        console.log("Play function ran!");
        setIsPlaying(true);

        // Start updating the progress periodically
        intervalRef.current = setInterval(() => {
          setProgress(audioRef.current.currentTime);
        }, 1000);

        // Handle end of playback to reset state
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setProgress(0);
          setIsPlaying(true);
          clearInterval(intervalRef.current);
        };
      } catch (error) {
        console.log("ERROR!", error);
      } finally {
        setIsLoading(false);
      }
    }, 500) // Adjust debounce time as needed
  ).current;

  const handleListenStory = async (storyToAudio) => {
    console.log("Handle Story run!");
    setIsLoading(true);
    debouncedFetchAudio(storyToAudio);
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    }
  };

  const handleResume = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);

      // Restart updating the progress
      intervalRef.current = setInterval(() => {
        setProgress(audioRef.current.currentTime);
      }, 1000);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset the playback position to the beginning
      setIsPlaying(false);
      setProgress(0);
      clearInterval(intervalRef.current);
    }
  };

  const handleSeek = (event) => {
    const newTime = event.target.value;
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 border-2 border-cyan-600 shadow-lg">
      <div className="flex items-center gap-4">
        {" "}
        <Button
          onClick={() => handleListenStory(storyToAudio)}
          disabled={isLoading || isPlaying}
          className="w-1/4"
        >
          <div className="flex justify-center items-center min-w-[60px] text-center">
            {isLoading ? <SmallSpinner /> : <h1>Listen</h1>}
          </div>
        </Button>
        <Button className="w-1/4" onClick={handlePause} disabled={!isPlaying}>
          Pause
        </Button>
        <Button
          className="w-1/4"
          onClick={handleResume}
          disabled={isPlaying || !audioRef.current}
        >
          Resume
        </Button>
        <Button
          className="w-1/4"
          onClick={handleStop}
          disabled={!audioRef.current}
        >
          Stop
        </Button>
      </div>
      <div className="w-full">
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in mm:ss
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export default StoryPlayer;
