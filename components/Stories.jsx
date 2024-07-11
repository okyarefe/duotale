"use client";
import { useState } from "react";
import Link from "next/link";
import { getStories } from "@/app/_lib/data-service";

const Stories = ({ initialStories, userId }) => {
  const [stories, setStories] = useState(initialStories);
  const [paginationStart, setPaginationStart] = useState(0);
  const [paginationEnd, setPaginationEnd] = useState(4);

  const loadStories = async (start, end) => {
    const newStories = await getStories(userId, start, end);
    setStories(newStories);
    setPaginationStart(start);
    setPaginationEnd(end);
  };

  const handleNext = async () => {
    const newPaginationStart = paginationEnd + 1;
    const newPaginationEnd = paginationEnd + 4;
    await loadStories(newPaginationStart, newPaginationEnd);
  };

  const handlePrevious = async () => {
    const newPaginationEnd = paginationStart - 1;
    const newPaginationStart = Math.max(0, newPaginationEnd - 3);
    await loadStories(newPaginationStart, newPaginationEnd);
  };

  return (
    <div>
      {stories.length > 0 ? (
        <>
          <ul>
            {stories.map((story) => (
              <li key={story.id}>
                <Link href={`/dialogs/${story.id}`}>
                  <button className="story-btn">
                    {story.english_story.slice(0, 20)}...
                  </button>
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <button
              className="pn-button"
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
