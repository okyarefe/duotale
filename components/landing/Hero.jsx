import React from "react";
import { Languages, Sparkles, Globe2 } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-32">
      <div className="absolute inset-0 bg-grid-indigo-100/50 bg-[size:20px_20px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-xl animate-bounce">
              <Languages size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              DuoTale
            </h2>
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Learn Languages Through
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mt-2">
              Magical Stories
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Experience a revolutionary way to master languages. Generate
            personalized stories, listen to native pronunciations, and learn
            naturally through immersive storytelling.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/chat">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
                <Globe2 size={20} />
                Join Early Access
              </button>
            </Link>

            <Link href="#demo">
              <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
                <Sparkles size={20} />
                Watch Demo
              </button>
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-8">
            <div className="bg-white px-6 py-4 rounded-xl shadow-lg">
              <p className="text-3xl font-bold text-indigo-600">10+</p>
              <p className="text-gray-600">Languages</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-xl shadow-lg">
              <p className="text-3xl font-bold text-indigo-600">AI</p>
              <p className="text-gray-600">Powered</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-xl shadow-lg">
              <p className="text-3xl font-bold text-indigo-600">Free</p>
              <p className="text-gray-600">Early Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
