"use client";
import { useState } from "react";
import Link from "next/link";
import { getStories } from "../app/_lib/data-service";
import Spinner from "../components/Spinner";

const Stories = ({ initialStories, userId }) => {
  const [stories, setStories] = useState(initialStories);
  const [paginationStart, setPaginationStart] = useState(0);
  const [paginationEnd, setPaginationEnd] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [storyNumber, setStoryNumber] = useState(0);

  const loadStories = async (start, end) => {
    setIsLoading(true);
    const newStories = await getStories(userId, start, end);
    setStories(newStories);
    setPaginationStart(start);
    setPaginationEnd(end);
    setIsLoading(false);
  };

  const handleNext = async () => {
    setIsLoading(true);
    const newPaginationStart = paginationEnd + 1;
    const newPaginationEnd = paginationEnd + 5;
    await loadStories(newPaginationStart, newPaginationEnd);
    setIsLoading(false);
    setPageNumber(pageNumber + 1);
  };

  const handlePrevious = async () => {
    const newPaginationEnd = paginationStart - 1;
    const newPaginationStart = Math.max(0, newPaginationEnd - 4);
    await loadStories(newPaginationStart, newPaginationEnd);
    setPageNumber(pageNumber - 1);
  };

  return (
    <div>
      {isLoading ? (
        <div className="loader-container">
          <Spinner color="blue" size={120}></Spinner>
        </div>
      ) : stories.length > 0 ? (
        <>
          <ul>
            {stories.map((story, index) => (
              <li key={story.id}>
                <Link href={`/dialogs/${story.id}`} className="w-1/2">
                  <button className="story-btn">
                    <p className="inline bg-slate-950 p-2">
                      Story - {index + 1 + pageNumber * 5}
                    </p>
                    -{story.english_story?.slice(0, 80)}
                    ...
                  </button>
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <button
              className="pn-button "
              onClick={handlePrevious}
              disabled={paginationStart === 0}
            >
              Previous
            </button>
            <button className="pn-button" onClick={handleNext}>
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <p>No stories found.</p>
          <button
            className="pn-button"
            onClick={handlePrevious}
            disabled={paginationStart === 0}
          >
            Previous
          </button>
        </>
      )}
    </div>
  );
};

export default Stories;
