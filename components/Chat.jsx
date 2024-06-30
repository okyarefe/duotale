"use client";

import { useState, useEffect } from "react";
import { generateChatResponse } from "../utils/actions";

// Helper function to split text into sentences
const splitTextIntoSentences = (text) => {
  return text.split(/(?<=[.?!])\s+/);
};

const Chat = () => {
  const [text, setText] = useState("");
  const [englishSentences, setEnglishSentences] = useState([]);
  const [finnishSentences, setFinnishSentences] = useState([]);
  const maxCharacters = 100;

  // Retrieve stored responses when component mounts
  useEffect(() => {
    const storedEnglishMessage = localStorage.getItem("englishMessage");
    const storedFinnishMessage = localStorage.getItem("finnishMessage");
    if (storedEnglishMessage)
      setEnglishSentences(splitTextIntoSentences(storedEnglishMessage));
    if (storedFinnishMessage)
      setFinnishSentences(splitTextIntoSentences(storedFinnishMessage));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { englishStory, finnishStory } = await generateChatResponse(text);
      setEnglishSentences(splitTextIntoSentences(englishStory));
      setFinnishSentences(splitTextIntoSentences(finnishStory));
      // Store the responses in local storage
      localStorage.setItem("englishMessage", englishStory);
      localStorage.setItem("finnishMessage", finnishStory);
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  const handleMouseOver = (index) => {
    document
      .getElementById(`english-sentence-${index}`)
      .classList.add("highlight");
    document
      .getElementById(`finnish-sentence-${index}`)
      .classList.add("highlight");
  };

  const handleMouseOut = (index) => {
    document
      .getElementById(`english-sentence-${index}`)
      .classList.remove("highlight");
    document
      .getElementById(`finnish-sentence-${index}`)
      .classList.remove("highlight");
  };

  return (
    <div className="p-6 space-y-4">
      {/* Prompt Div */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <textarea
            maxLength={maxCharacters}
            value={text}
            required={true}
            onChange={(e) => setText(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Enter your prompt here..."
          />
          <div className="text-right text-sm text-gray-500">
            {text.length}/{maxCharacters} characters
          </div>
          <button type="submit" className="btn btn-primary self-end">
            Submit
          </button>
        </form>
      </div>

      {/* Stories Div */}
      <div className="flex space-x-4">
        {/* English Story Div */}
        <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">English Story</h2>
          <p className="color-white-100">
            {englishSentences.map((sentence, index) => (
              <span
                key={index}
                id={`english-sentence-${index}`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={() => handleMouseOut(index)}
              >
                {sentence + " "}
              </span>
            ))}
          </p>
        </div>
        {/* Finnish Story Div */}
        <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Finnish Story</h2>
          <p className="color-white-100">
            {finnishSentences.map((sentence, index) => (
              <span
                key={index}
                id={`finnish-sentence-${index}`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={() => handleMouseOut(index)}
              >
                {sentence + " "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;

// "use client";

// import { useState, useEffect } from "react";
// import { generateChatResponse } from "../utils/actions";

// const Chat = () => {
//   const [text, setText] = useState("");
//   const [englishMessage, setEnglishMessage] = useState("");
//   const [finnishMessage, setFinnishMessage] = useState("");
//   const maxCharacters = 100;

//   // Retrieve stored responses when component mounts
//   useEffect(() => {
//     const storedEnglishMessage = localStorage.getItem("englishMessage");
//     const storedFinnishMessage = localStorage.getItem("finnishMessage");
//     if (storedEnglishMessage) setEnglishMessage(storedEnglishMessage);
//     if (storedFinnishMessage) setFinnishMessage(storedFinnishMessage);
//   }, [englishMessage, finnishMessage]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { englishStory, finnishStory } = await generateChatResponse(text);
//       setEnglishMessage(englishStory);
//       setFinnishMessage(finnishStory);
//       // Store the responses in local storage
//       localStorage.setItem("englishMessage", englishStory);
//       localStorage.setItem("finnishMessage", finnishStory);
//     } catch (error) {
//       console.error("Error generating response:", error);
//     }
//   };

//   return (
//     <div className="p-6 space-y-4">
//       {/* Prompt Div */}
//       <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//         <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
//           <textarea
//             maxLength={maxCharacters}
//             value={text}
//             required={true}
//             onChange={(e) => setText(e.target.value)}
//             className="textarea textarea-bordered w-full"
//             placeholder="Enter your prompt here..."
//           />
//           <div className="text-right text-sm text-gray-500">
//             {text.length}/{maxCharacters} characters
//           </div>
//           <button type="submit" className="btn btn-primary self-end">
//             Submit
//           </button>
//         </form>
//       </div>

//       {/* Stories Div */}
//       <div className="flex space-x-4">
//         {/* English Story Div */}
//         <div className="w-1/2 bg-blue-100 p-4 rounded-lg shadow-md">
//           <h2 className="text-lg font-bold mb-2">English Story</h2>
//           <p>{englishMessage}</p>
//         </div>
//         {/* Finnish Story Div */}
//         <div className="w-1/2 bg-green-100 p-4 rounded-lg shadow-md">
//           <h2 className="text-lg font-bold mb-2">Finnish Story</h2>
//           <p>{finnishMessage}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
