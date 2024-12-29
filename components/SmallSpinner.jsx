import React from "react";

const SmallSpinner = () => {
  return (
    <div className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
};

export default SmallSpinner;
