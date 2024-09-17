// SubscriptionPage.jsx
import React from "react";

const SubscriptionPage = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs ">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Basic Pack
          </h2>
          <p className="text-xl text-gray-700 mb-2">3000 Tokens</p>
          <p className="text-lg text-gray-500 mb-4">50 Word Translations</p>
          <p>
            Only for
            <p className="text-2xl font-bold text-blue-600 mb-6">€4</p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
