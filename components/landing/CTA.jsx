import React from "react";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="bg-indigo-600 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Your Multilingual Journey?
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already creating and sharing stories
          across languages.
        </p>
        <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
          Get Started Free
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CTA;
