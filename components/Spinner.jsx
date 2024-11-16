import React from "react";
import {
  BookOpen,
  Languages,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative">
        {/* Main book icon */}
        <BookOpen className="w-12 h-12 text-blue-500 animate-bounce" />

        {/* Floating elements */}
        <div className="absolute -top-4 -left-8 animate-float-1">
          <Languages className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="absolute -top-6 left-6 animate-float-2">
          <GraduationCap className="w-6 h-6 text-purple-400" />
        </div>
        <div className="absolute -top-2 -right-6 animate-float-3">
          <MessageCircle className="w-6 h-6 text-pink-400" />
        </div>

        {/* Loading dots */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spinner;
