function WordOnClickTranslation({
  word,
  x,
  y,
  translatedWord,
  isError,
  closePopup,
  setWordPopup,
  wordPopup,
}) {
  return (
    <div
      className="word-translation-popup"
      style={{
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        background: "white",
        border: "1px solid black",
        borderRadius: "5px",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      <>
        {isError ? (
          <h1>Not enough tokens</h1>
        ) : (
          <p className="text-lg font-semibold">
            <span className="text-blue-600">{word}</span>
            <span className="text-gray-500">→</span>
            <span className="text-green-600 mr-10 m-5">{translatedWord}</span>
          </p>
        )}
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 p-1 bg-white text-gray-500 hover:text-gray-700 focus:outline-none border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </>
    </div>
  );
}

export default WordOnClickTranslation;
