import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-blue-500">
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`absolute w-8 h-8 bg-white rounded-full shadow-md
                        animate-bounce
                        ${
                          index === 0
                            ? "left-0 animation-delay-0"
                            : index === 1
                            ? "left-8 top-12 animation-delay-150"
                            : "left-16 animation-delay-500"
                        }`}
            style={{
              animationDuration: "0.6s",
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Spinner;
