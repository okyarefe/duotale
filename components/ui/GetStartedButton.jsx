"use client";
import { useState } from "react";

const GetStartedButton = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleGetStarted = (e) => {
    e.preventDefault();
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000); // Hide the popup after 3 seconds
  };

  return (
    <>
      <button
        onClick={handleGetStarted}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Get Started
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-semibold text-black">
              Our service will be online shortly..
              <br />
              Thank you for your patience!..
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GetStartedButton;
