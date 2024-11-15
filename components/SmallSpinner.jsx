import React from "react";

const SmallSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full text-center">
      <div className="relative w-4 h-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`absolute w-3 h-3 bg-white rounded-full shadow-sm
                        animate-bounce
                        ${
                          index === 0
                            ? "left-0 animation-delay-0"
                            : index === 1
                            ? "left-2 top-2 animation-delay-150"
                            : "left-4 animation-delay-500"
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

export default SmallSpinner;
