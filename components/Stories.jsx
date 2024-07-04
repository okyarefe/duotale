// components/Stories.js
"use client";

// components/Stories.js
import Link from "next/link";

const Stories = ({ stories }) => {
  return (
    <div>
      <h1>Stories List</h1>
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

// import React, { useState } from "react";

// const Stories = ({ stories }) => {
//   const [selectedStory, setSelectedStory] = useState(null);

//   const handleStoryClick = (story) => {
//     setSelectedStory(story);
//   };

//   return (
//     <div>
//       <h1>Stories List</h1>
//       {stories.length > 0 ? (
//         <ul>
//           {stories.map((story) => (
//             <li key={story.id}>
//               <button onClick={() => handleStoryClick(story)}>
//                 Story {story.id}
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No stories found.</p>
//       )}
//       {selectedStory && (
//         <div>
//           <h1>Story Detail</h1>
//           <h2>English Story:</h2>
//           <p>{selectedStory.english_story}</p>
//           <h2>Finnish Story:</h2>
//           <p>{selectedStory.finnish_story}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Stories;

// import Link from "next/link";

// const Stories = ({ stories }) => {
//   return (
//     <div>
//       <h1>Stories List</h1>
//       {stories.length > 0 ? (
//         <ul>
//           {stories.map((story) => (
//             <li key={story.id}>
//               <Link href={`/dialogs/${story.id}`}>
//                 <button>Story {story.id}</button>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No stories found.</p>
//       )}
//     </div>
//   );
// };

// export default Stories;
