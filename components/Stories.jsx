"use client";
import { useState } from "react";
import Link from "next/link";
import { getStories } from "@/app/_lib/data-service";

const Stories = ({ stories, userId }) => {
  return (
    <div>
      {stories.length > 0 ? (
        <ul>
          {stories.map((story) => (
            <li key={story.id}>
              <Link href={`/dialogs/${story.id}`}>
                <button>Story {story.id}</button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stories found.</p>
      )}
    </div>
  );
};

export default Stories;
