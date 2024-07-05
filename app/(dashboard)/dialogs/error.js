"use client";
// components/Error.js

const Error = ({ error, reset }) => {
  return (
    <div className="error-container">
      <h1>An Error Occurred</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
      <style jsx>{`
        .error-container {
          padding: 2rem;
          text-align: center;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0058b3;
        }
      `}</style>
    </div>
  );
};

export default Error;
