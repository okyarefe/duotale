import React from "react";

const Error = () => {
  return (
    <div className="error-container">
      <h1>Sorry, something went wrong.</h1>
      <p>Please try again later.</p>
      <style jsx>{`
        .error-container {
          padding: 2rem;
          text-align: center;
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          margin: 1rem 0;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default Error;
