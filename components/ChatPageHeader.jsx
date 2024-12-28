import React from "react";
import { Languages, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-3 rounded-2xl">
          <Languages size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Story Generator
          </h1>
          <p className="text-gray-600">
            Create magical stories in any language
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
        <Sparkles className="text-yellow-500" size={20} />
        <span className="text-indigo-700 font-medium">Premium Member</span>
      </div>
    </div>
  );
};

export default Header;
