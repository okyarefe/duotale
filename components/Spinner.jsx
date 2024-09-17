import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`absolute w-8 h-8 bg-white rounded-full shadow-lg
                      animate-bounce
                      ${
                        index === 0
                          ? "left-0 animation-delay-0"
                          : index === 1
                          ? "left-8 top-8 animation-delay-150"
                          : "left-16 animation-delay-300"
                      }`}
            style={{
              animationDuration: "0.8s",
              animationIterationCount: "infinite",
            }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-75"></div>
            <div className="absolute inset-1 rounded-full border border-blue-200"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300 to-indigo-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spinner;
