"use client";
import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import Link from "next/link";
import { getStories } from "../app/_lib/data-service";
import Spinner from "../components/Spinner";
import StoryCard from "./StoryCard";

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
          {
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
              <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      My Stories
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Your personal collection of language learning stories
                    </p>
                  </div>
                  <Link href="/chat">
                    <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
                      <Plus className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
                      Create a new story
                    </button>
                  </Link>
                </div>

                {stories.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No stories yet
                    </h3>
                    <p className="text-gray-500">
                      Start creating your first language learning story!
                    </p>
                    <div></div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div className="flex justify-end">
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
                    {stories.map((story, index) => (
                      <li key={story.id}>
                        <Link href={`/dialogs/${story.id}`} className="w-1/2">
                          <StoryCard key={story.id} story={story} />
                        </Link>
                      </li>
                    ))}
                  </div>
                )}
              </div>
            </div>
          }
        </>
      ) : (
        <>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-500">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-4 py-2 font-medium text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Click here to create your first language learning story!
              </Link>
            </p>
          </div>
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
